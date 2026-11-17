import type { Shipment } from "./shipments";

export type LL = [number, number]; // [lat, lon]

const R = 6371;
const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

export function haversine(a: LL, b: LL): number {
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/* points on the great circle between a and b (both ends included): the shortest curve over the globe */
export function greatCircle(a: LL, b: LL, n: number): LL[] {
  const [lat1, lon1, lat2, lon2] = [toRad(a[0]), toRad(a[1]), toRad(b[0]), toRad(b[1])];
  const d = 2 * Math.asin(Math.sqrt(Math.sin((lat2 - lat1) / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2));
  if (!d) return [a, b];
  const out: LL[] = [];
  for (let i = 0; i <= n; i++) {
    const f = i / n;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    out.push([toDeg(Math.atan2(z, Math.sqrt(x * x + y * y))), toDeg(Math.atan2(y, x))]);
  }
  return out;
}

/* interpolate in Mercator space so the vehicle sits exactly on the line Leaflet draws */
const merc = (lat: number) => Math.log(Math.tan(Math.PI / 4 + toRad(lat) / 2));
const unmerc = (y: number) => toDeg(2 * Math.atan(Math.exp(y)) - Math.PI / 2);
const lerp = (a: LL, b: LL, t: number): LL => [unmerc(merc(a[0]) + (merc(b[0]) - merc(a[0])) * t), a[1] + (b[1] - a[1]) * t];

export function bearing(a: LL, b: LL): number {
  const y = Math.sin(toRad(b[1] - a[1])) * Math.cos(toRad(b[0]));
  const x = Math.cos(toRad(a[0])) * Math.sin(toRad(b[0])) - Math.sin(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.cos(toRad(b[1] - a[1]));
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export type Stop = { index: number; name: string; place: string; kind: string; when?: string; lat: number; lon: number; at: number; km: number };
export type Geo = { path: LL[]; cum: number[]; total: number; stops: Stop[]; p0: number; cap: number; delivered: boolean };

/* the route is the path from the routing service (shipment.path), or a straight line if there is none.
   The vehicle's progress is measured along this path. */
export function buildGeo(s: Shipment): Geo {
  const origin = s.route[0];
  const dest = s.route[s.route.length - 1];
  const a: LL = [origin.lat, origin.lon];
  const b: LL = [dest.lat, dest.lon];
  const path: LL[] = s.path && s.path.length > 1 ? s.path : [a, b];

  const cum = [0];
  for (let i = 1; i < path.length; i++) cum.push(cum[i - 1] + haversine(path[i - 1], path[i]));
  const total = cum[cum.length - 1];

  const p0 = Math.min(Math.max(s.at.fraction, 0), 1);
  const delivered = s.stage >= 4;
  const cap = delivered ? p0 : Math.max(p0, 0.98); // the demo vehicle parks just short of the destination
  const stops: Stop[] = [
    { index: 0, name: origin.name, place: origin.place, kind: origin.kind, when: origin.when, lat: a[0], lon: a[1], at: 0, km: 0 },
    { index: s.route.length - 1, name: dest.name, place: dest.place, kind: dest.kind, when: dest.when, lat: b[0], lon: b[1], at: 1, km: Math.round(total) },
  ];
  return { path, cum, total, stops, p0, cap, delivered };
}

function locate(g: Geo, p: number): { i: number; t: number } {
  const target = Math.min(Math.max(p, 0), 1) * g.total;
  let i = 0;
  while (i < g.cum.length - 2 && g.cum[i + 1] < target) i++;
  const span = g.cum[i + 1] - g.cum[i] || 1;
  return { i, t: Math.min(Math.max((target - g.cum[i]) / span, 0), 1) };
}

export function pointAt(g: Geo, p: number): LL {
  const { i, t } = locate(g, p);
  return lerp(g.path[i], g.path[i + 1], t);
}

export function splitAt(g: Geo, p: number): { done: LL[]; rest: LL[] } {
  const { i } = locate(g, p);
  const pt = pointAt(g, p);
  return { done: [...g.path.slice(0, i + 1), pt], rest: [pt, ...g.path.slice(i + 1)] };
}
