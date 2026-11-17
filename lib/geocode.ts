import type { LL } from "./geo";

/* server only. Turns an address into coordinates with OpenStreetMap Nominatim (free, no key).
   Usage policy: identify the app in User-Agent and use at most one request per second, so lookups are spaced out. */

export type Place = { lat: number; lon: number; display: string };

const cache = new Map<string, Place | null>();
let lastCall = 0;

/* null: no place matched the address. Throws: the lookup service could not be reached. */
export async function geocode(address: string): Promise<Place | null> {
  const q = address.trim().toLowerCase();
  if (cache.has(q)) return cache.get(q) ?? null;

  const wait = lastCall + 1100 - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCall = Date.now();

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=0&q=${encodeURIComponent(address.trim())}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { "user-agent": "PioneerCargoTracking/1.0" } });
  if (!res.ok) throw new Error(`geocoder ${res.status}`);
  const json: unknown = await res.json();
  if (!Array.isArray(json)) throw new Error("geocoder response");
  const hit = json[0] as { lat?: unknown; lon?: unknown; display_name?: unknown } | undefined;
  if (!hit || typeof hit.lat !== "string" || typeof hit.lon !== "string") {
    cache.set(q, null);
    return null;
  }
  const place: Place = {
    lat: Number(hit.lat),
    lon: Number(hit.lon),
    display: typeof hit.display_name === "string" ? hit.display_name : address.trim(),
  };
  cache.set(q, place);
  return place;
}

export const toLL = (p: Place): LL => [p.lat, p.lon];
