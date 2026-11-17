import { randomInt } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { geocode, type Place } from "./geocode";
import { SERVICES, STATUSES, type OrderInput } from "./orderOptions";
import { routePath, type Routed } from "./routing";
import type { Mode, Shipment, Waypoint } from "./shipments";

/* server only. Orders are stored in a plain text file, one order per line as JSON.
   Path: ORDERS_FILE in .env (default data/orders.txt). */

/* Tracking number: GL-<id><code4>-<code3>plc
   <id> is the order's id, padded to 4 digits, so the lookup goes straight to the order.
   <code4><code3> is 7 random characters stored with the order. A number only works if the id and the code both match. */

const CODE_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";
const randomCode = () => Array.from({ length: 7 }, () => CODE_CHARS[randomInt(CODE_CHARS.length)]).join("");

export function formatNumber(id: number, code: string): string {
  return `GL-${String(id).padStart(4, "0")}${code.slice(0, 4)}-${code.slice(4)}plc`;
}

export function parseNumber(raw: string): { id: number; code: string } | null {
  const m = /^gl-(\d+)([a-z0-9]{4})-([a-z0-9]{3})plc$/.exec(raw.trim().toLowerCase());
  if (!m) return null;
  const id = Number(m[1]);
  return id > 0 ? { id, code: m[2] + m[3] } : null;
}

/* the address could not be matched to a place on the map */
export class AddressNotFound extends Error {}

type OrderRow = {
  id: number;
  check_code: string;
  status: string;
  stage: number;
  service: string;
  mode: Mode;
  from_name: string;
  from_place: string;
  from_lat: number;
  from_lon: number;
  to_name: string;
  to_place: string;
  to_lat: number;
  to_lon: number;
  eta: string; // YYYY-MM-DD
  weight_value: number;
  weight_unit: string;
  packages: number;
  path?: [number, number][]; // the route the shipment follows, worked out when the order was saved
  routed?: boolean; // true when that path follows roads; false means a straight arc was used
};

export type AdminOrder = {
  id: number;
  number: string;
  input: OrderInput;
  fromPlace: string;
  toPlace: string;
};

const filePath = () => path.resolve(/* turbopackIgnore: true */ process.env.ORDERS_FILE || path.join("data", "orders.txt"));

async function readRows(): Promise<OrderRow[]> {
  let text: string;
  try {
    text = await fs.readFile(filePath(), "utf8");
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "code" in e && e.code === "ENOENT") return [];
    throw e;
  }
  return text
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => JSON.parse(line) as OrderRow); // a corrupt line stops the request instead of losing data
}

/* before every change the current file is copied to data/backups/, and only the newest backups are kept */
const BACKUP_KEEP = Number(process.env.ORDERS_BACKUP_KEEP) > 0 ? Number(process.env.ORDERS_BACKUP_KEEP) : 100;

async function backupCurrent(file: string): Promise<void> {
  try {
    await fs.access(file);
  } catch {
    return; // nothing to back up yet
  }
  const dir = path.join(path.dirname(file), "backups");
  await fs.mkdir(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  await fs.copyFile(file, path.join(dir, `orders-${stamp}.txt`));
  const names = (await fs.readdir(dir)).filter((n) => /^orders-.*\.txt$/.test(n)).sort();
  for (const old of names.slice(0, Math.max(0, names.length - BACKUP_KEEP))) {
    await fs.unlink(path.join(dir, old));
  }
}

async function writeRows(rows: OrderRow[]): Promise<void> {
  const file = filePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await backupCurrent(file);
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, rows.map((r) => JSON.stringify(r)).join("\n") + (rows.length ? "\n" : ""), "utf8");
  await fs.rename(tmp, file);
}

/* writes run one at a time so two admin requests cannot overwrite each other */
let queue: Promise<unknown> = Promise.resolve();
function exclusive<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

const formatEta = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" });

function rowToShipment(r: OrderRow): Shipment {
  const origin: Waypoint = { name: r.from_name, place: r.from_place, lat: r.from_lat, lon: r.from_lon, kind: "origin" };
  const destination: Waypoint = { name: r.to_name, place: r.to_place, lat: r.to_lat, lon: r.to_lon, kind: "destination" };
  return {
    number: formatNumber(r.id, r.check_code),
    status: r.status,
    stage: r.stage,
    mode: r.mode,
    service: r.service,
    from: r.from_name,
    to: r.to_name,
    eta: formatEta(r.eta),
    weight: `${r.weight_value} ${r.weight_unit}`,
    packages: r.packages,
    route: [origin, destination],
    at: { after: 0, fraction: 0 }, // the vehicle starts at the departure point and moves at the set speed
    path: r.path,
  };
}

function rowToInput(r: OrderRow): OrderInput {
  return {
    status: r.status,
    service: r.service,
    fromAddress: r.from_name,
    toAddress: r.to_name,
    eta: r.eta,
    weightValue: r.weight_value,
    weightUnit: r.weight_unit === "lb" ? "lb" : "kg",
    packages: r.packages,
  };
}

/* the stage and transport mode are derived from the labels the admin picked */
function derived(input: OrderInput): { stage: number; mode: Mode } {
  const stage = STATUSES.find((s) => s.label === input.status)?.stage ?? 0;
  const mode = SERVICES.find((s) => s.label === input.service)?.mode ?? "road";
  return { stage, mode };
}

async function locate(address: string): Promise<Place> {
  const place = await geocode(address);
  if (!place) throw new AddressNotFound(`We could not find "${address}". Add the city and country, for example "Toronto, Canada".`);
  return place;
}

function toRow(id: number, code: string, input: OrderInput, from: Place, to: Place, route: Routed): OrderRow {
  const { stage, mode } = derived(input);
  return {
    id,
    check_code: code,
    path: route.path,
    routed: route.routed,
    status: input.status,
    stage,
    service: input.service,
    mode,
    from_name: input.fromAddress,
    from_place: from.display,
    from_lat: from.lat,
    from_lon: from.lon,
    to_name: input.toAddress,
    to_place: to.display,
    to_lat: to.lat,
    to_lon: to.lon,
    eta: input.eta,
    weight_value: input.weightValue,
    weight_unit: input.weightUnit,
    packages: input.packages,
  };
}

export async function findShipmentByNumber(raw: string): Promise<Shipment | null> {
  const parsed = parseNumber(raw);
  if (!parsed) return null;
  const row = (await readRows()).find((r) => r.id === parsed.id && r.check_code === parsed.code);
  return row ? rowToShipment(row) : null;
}

export async function listOrders(): Promise<AdminOrder[]> {
  const rows = await readRows();
  return rows
    .sort((a, b) => b.id - a.id)
    .map((r) => ({
      id: r.id,
      number: formatNumber(r.id, r.check_code),
      input: rowToInput(r),
      fromPlace: r.from_place,
      toPlace: r.to_place,
    }));
}

export async function createOrder(input: OrderInput): Promise<{ id: number; number: string }> {
  const from = await locate(input.fromAddress);
  const to = await locate(input.toAddress);
  const route = await routePath(derived(input).mode, [from.lat, from.lon], [to.lat, to.lon]);
  return exclusive(async () => {
    const rows = await readRows();
    const id = rows.reduce((max, r) => Math.max(max, r.id), 0) + 1;
    const code = randomCode();
    await writeRows([...rows, toRow(id, code, input, from, to, route)]);
    return { id, number: formatNumber(id, code) };
  });
}

export async function updateOrder(id: number, input: OrderInput): Promise<boolean> {
  const current = (await readRows()).find((r) => r.id === id);
  if (!current) return false;

  /* look up an address again only when it changed */
  const from: Place = current.from_name === input.fromAddress
    ? { lat: current.from_lat, lon: current.from_lon, display: current.from_place }
    : await locate(input.fromAddress);
  const to: Place = current.to_name === input.toAddress
    ? { lat: current.to_lat, lon: current.to_lon, display: current.to_place }
    : await locate(input.toAddress);

  /* keep the stored road route; recalculate when the route changed or the last try fell back to a straight arc */
  const sameRoute = from.lat === current.from_lat && from.lon === current.from_lon &&
    to.lat === current.to_lat && to.lon === current.to_lon && current.service === input.service;
  const route: Routed = sameRoute && current.path && current.routed === true
    ? { path: current.path, routed: true }
    : await routePath(derived(input).mode, [from.lat, from.lon], [to.lat, to.lon]);

  return exclusive(async () => {
    const rows = await readRows();
    const index = rows.findIndex((r) => r.id === id);
    if (index < 0) return false;
    const next = [...rows];
    next[index] = toRow(id, rows[index].check_code, input, from, to, route);
    await writeRows(next);
    return true;
  });
}

/* a delivered order is removed from the file */
export function deleteOrder(id: number): Promise<boolean> {
  return exclusive(async () => {
    const rows = await readRows();
    const next = rows.filter((r) => r.id !== id);
    if (next.length === rows.length) return false;
    await writeRows(next);
    return true;
  });
}
