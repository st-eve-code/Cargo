import type { Mode } from "./shipments";

export const SERVICES: { label: string; mode: Mode }[] = [
  { label: "Air Freight", mode: "air" },
  { label: "Ocean Freight", mode: "ocean" },
  { label: "Road Transportation", mode: "road" },
];

export const STATUSES: { label: string; stage: number }[] = [
  { label: "Order received", stage: 0 },
  { label: "Picked up", stage: 1 },
  { label: "In transit", stage: 2 },
  { label: "Out for delivery", stage: 3 },
];

export const WEIGHT_UNITS = ["kg", "lb"] as const;
export type WeightUnit = (typeof WEIGHT_UNITS)[number];

export type OrderInput = {
  status: string;
  service: string;
  fromAddress: string;
  toAddress: string;
  eta: string; // YYYY-MM-DD
  weightValue: number;
  weightUnit: WeightUnit;
  packages: number;
};

export type ParseResult = { ok: true; value: OrderInput } | { ok: false; error: string };

const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const num = (v: unknown) => {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "") return Number(v);
  return NaN;
};

/* accepts numbers or numeric strings (the admin form sends strings) and returns clean values or the first problem */
export function parseOrderInput(raw: unknown): ParseResult {
  if (typeof raw !== "object" || raw === null) return { ok: false, error: "Invalid order." };
  const r = raw as Record<string, unknown>;

  const status = text(r.status);
  if (!STATUSES.some((s) => s.label === status)) return { ok: false, error: "Choose a status." };
  const service = text(r.service);
  if (!SERVICES.some((s) => s.label === service)) return { ok: false, error: "Choose a service." };

  const fromAddress = text(r.fromAddress);
  const toAddress = text(r.toAddress);
  if (fromAddress.length < 3 || fromAddress.length > 200) return { ok: false, error: "Enter the departure address, for example Lagos, Nigeria." };
  if (toAddress.length < 3 || toAddress.length > 200) return { ok: false, error: "Enter the destination address, for example Toronto, Canada." };

  const eta = text(r.eta);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(eta) || Number.isNaN(Date.parse(eta))) return { ok: false, error: "Enter the estimated delivery date." };

  const weightValue = num(r.weightValue);
  if (!Number.isFinite(weightValue) || weightValue <= 0 || weightValue > 100000) return { ok: false, error: "Enter the weight." };
  const weightUnit = text(r.weightUnit);
  if (weightUnit !== "kg" && weightUnit !== "lb") return { ok: false, error: "Choose kg or lb." };

  const packages = num(r.packages);
  if (!Number.isInteger(packages) || packages < 1 || packages > 100000) return { ok: false, error: "Enter the number of packages (1 or more)." };

  return {
    ok: true,
    value: { status, service, fromAddress, toAddress, eta, weightValue, weightUnit, packages },
  };
}
