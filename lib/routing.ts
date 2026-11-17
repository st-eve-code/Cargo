import { greatCircle, haversine, type LL } from "./geo";
import type { Mode, Shipment } from "./shipments";

/* server only. Builds the path a shipment follows on the map.
   road: the driving route from OSRM (free public server, no key; meant for light use).
   air and ocean: a great-circle arc. No free sea-routing service is connected yet.
   If the road service is down, the arc is used instead. */

const ROAD_TTL_MS = 24 * 60 * 60 * 1000;
const FALLBACK_TTL_MS = 5 * 60 * 1000; // if the road service failed, try again soon
const cache = new Map<string, { at: number; ttl: number; path: LL[]; routed: boolean }>();

export type Routed = { path: LL[]; routed: boolean }; // routed: true when the path follows roads from the routing service

/* removes routes whose time-to-live has passed, so routes nobody asks for again do not stay in memory */
function store(k: string, entry: { at: number; ttl: number; path: LL[]; routed: boolean }): void {
  const now = Date.now();
  for (const [old, value] of cache) {
    if (now - value.at >= value.ttl) cache.delete(old);
  }
  cache.set(k, entry);
}

const key = (a: LL, b: LL) => `${a[0].toFixed(4)},${a[1].toFixed(4)}|${b[0].toFixed(4)},${b[1].toFixed(4)}`;

const isPair = (v: unknown): v is [number, number] =>
  Array.isArray(v) && v.length === 2 && typeof v[0] === "number" && typeof v[1] === "number";

/* keeps about one point per kilometre (plus the last point): the same road, a fraction of the data */
function thin(points: LL[]): LL[] {
  const out: LL[] = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    if (haversine(out[out.length - 1], points[i]) >= 1) out.push(points[i]);
  }
  out.push(points[points.length - 1]);
  return out;
}

/* OSRM servers, asked at the same time: the first good answer wins. The first is the car profile on openstreetmap.de,
   the second is the public OSRM demo server. */
const OSRM = [
  "https://routing.openstreetmap.de/routed-car/route/v1/driving/",
  "https://router.project-osrm.org/route/v1/driving/",
];

async function osrmPath(base: string, a: LL, b: LL): Promise<LL[]> {
  const url = `${base}${a[1]},${a[0]};${b[1]},${b[0]}?overview=full&geometries=geojson`;
  const res = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { "user-agent": "pioneer-cargo-tracking" } });
  if (!res.ok) throw new Error(`routing ${res.status}`);
  const json = (await res.json()) as { code?: unknown; routes?: { geometry?: { coordinates?: unknown } }[] };
  const coords = json.routes?.[0]?.geometry?.coordinates;
  if (json.code !== "Ok" || !Array.isArray(coords) || coords.length < 2 || !coords.every(isPair)) throw new Error("no route");
  return thin(coords.map(([lon, lat]) => [lat, lon] as LL));
}

async function drivingPath(a: LL, b: LL): Promise<LL[] | null> {
  try {
    return await Promise.any(OSRM.map((base) => osrmPath(base, a, b)));
  } catch {
    return null;
  }
}

export async function routePath(mode: Mode, a: LL, b: LL): Promise<Routed> {
  const k = `${mode}|${key(a, b)}`;
  const hit = cache.get(k);
  if (hit && Date.now() - hit.at < hit.ttl) return { path: hit.path, routed: hit.routed };

  const arc = greatCircle(a, b, Math.max(32, Math.ceil(haversine(a, b) / 50)));
  if (mode === "road") {
    const path = await drivingPath(a, b);
    if (path) {
      store(k, { at: Date.now(), ttl: ROAD_TTL_MS, path, routed: true });
      return { path, routed: true };
    }
    store(k, { at: Date.now(), ttl: FALLBACK_TTL_MS, path: arc, routed: false });
    return { path: arc, routed: false };
  }

  store(k, { at: Date.now(), ttl: ROAD_TTL_MS, path: arc, routed: false });
  return { path: arc, routed: false };
}

/* adds the route the shipment follows, unless it was stored with the order; the first and last route points are its departure and destination */
export async function withRoute(s: Shipment): Promise<Shipment> {
  if (s.path && s.path.length > 1) return s;
  const first = s.route[0];
  const last = s.route[s.route.length - 1];
  const { path } = await routePath(s.mode, [first.lat, first.lon], [last.lat, last.lon]);
  return { ...s, path };
}
