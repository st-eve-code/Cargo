import type { LL } from "./geo";

/* server only. Turns an address into coordinates with OpenStreetMap Nominatim (free, no key).
   Usage policy: identify the app in User-Agent and use at most one request per second, so lookups are spaced out. */

export type Place = { lat: number; lon: number; display: string };

const CACHE_MAX = 500;
const cache = new Map<string, Place | null>();
let lastCall = 0;
let queue: Promise<unknown> = Promise.resolve();

/* lookups run one at a time, so concurrent requests are spaced out too */
function spaced<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const wait = lastCall + 1100 - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastCall = Date.now();
    return task();
  });
  queue = run.catch(() => undefined);
  return run;
}

/* the map keeps insertion order, so the first key is the oldest */
function remember(q: string, place: Place | null): void {
  if (!cache.has(q) && cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value as string);
  cache.set(q, place);
}

/* null: no place matched the address. Throws: the lookup service could not be reached. */
export async function geocode(address: string): Promise<Place | null> {
  const q = address.trim().toLowerCase();
  if (cache.has(q)) return cache.get(q) ?? null;
  return spaced(() => lookup(address, q));
}

async function lookup(address: string, q: string): Promise<Place | null> {
  if (cache.has(q)) return cache.get(q) ?? null;
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=0&q=${encodeURIComponent(address.trim())}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { "user-agent": "PioneerCargoTracking/1.0" } });
  if (!res.ok) throw new Error(`geocoder ${res.status}`);
  const json: unknown = await res.json();
  if (!Array.isArray(json)) throw new Error("geocoder response");
  const hit = json[0] as { lat?: unknown; lon?: unknown; display_name?: unknown } | undefined;
  if (!hit || typeof hit.lat !== "string" || typeof hit.lon !== "string") {
    remember(q, null);
    return null;
  }
  const place: Place = {
    lat: Number(hit.lat),
    lon: Number(hit.lon),
    display: typeof hit.display_name === "string" ? hit.display_name : address.trim(),
  };
  remember(q, place);
  return place;
}

export const toLL = (p: Place): LL => [p.lat, p.lon];
