"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type * as Lf from "leaflet";
import { bearing, pointAt, splitAt, type Geo, type LL } from "@/lib/geo";
import type { Shipment } from "@/lib/shipments";

export type Layer = "map" | "sat";
export type Focus = { ll: LL; n: number };

/* Free tiles for development. Check each provider's usage terms before launch, or switch to your own key (MapTiler, Stadia, Mapbox...). */
const TILES = {
  map: {
    url: "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_59lm_1_933e5b609c8677fc3b0d447a",
    opts: { subdomains: "abcd", maxZoom: 20, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>' },
  },
  sat: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    opts: { maxZoom: 20, attribution: "Tiles &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community" },
  },
};

const esc = (t: string) => t.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

const svg = (inner: string, extra = "") => `<svg viewBox="0 0 24 24" width="18" height="18" ${extra} aria-hidden="true">${inner}</svg>`;
const stroke = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
const VEHICLE: Record<Shipment["mode"], string> = {
  air: svg('<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/>', 'fill="currentColor"'),
  ocean: svg('<path d="M3 15h18l-2 4H5z"/><path d="M6 15V9h12v6M12 9V5h3"/>', stroke),
  road: svg('<path d="M2 7h11v9H2zM13 10h4l3 3v3h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>', stroke),
};
const CHECK = '<svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 6.3 5 8.8l4.5-5.2"/></svg>';
const FLAG = '<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path d="M6 3v18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M6 4h12l-3 4 3 4H6z" fill="currentColor"/></svg>';

type Internal = Lf.Marker & { _icon?: HTMLElement; _map?: Lf.Map; _latlng: Lf.LatLng; _setPos: (p: Lf.Point) => void };
type Api = { update: (p: number) => void; setLayer: (l: Layer) => void; fly: (ll: LL) => void };

type Props = { s: Shipment; geo: Geo; progress: number; layer: Layer; focus: Focus | null };

export default function TrackMap({ s, geo, progress, layer, focus }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const api = useRef<Api | null>(null);
  const latest = useRef({ progress, layer });
  latest.current = { progress, layer };

  useEffect(() => {
    let dead = false;
    let cleanup = () => {};

    (async () => {
      const mod = (await import("leaflet")) as unknown as { default?: typeof Lf } & typeof Lf;
      const L = mod.default ?? mod;
      if (dead || !el.current) return;

      const map = L.map(el.current, { zoomControl: false, worldCopyJump: true, minZoom: 2, zoomSnap: 0.25 });
      const layers = {
        map: L.tileLayer(TILES.map.url, TILES.map.opts),
        sat: L.tileLayer(TILES.sat.url, TILES.sat.opts),
      };
      let current: Layer = latest.current.layer;
      layers[current].addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      const whole = L.polyline(geo.path, { color: "#0d1424", weight: 2, opacity: 0.18, dashArray: "3 7" }).addTo(map);
      map.fitBounds(whole.getBounds(), { padding: [80, 80] });
      const rest = L.polyline([], { color: "#0d1424", weight: 2.5, opacity: 0.6, dashArray: "1 8", lineCap: "round" }).addTo(map);
      const done = L.polyline([], { color: "#ff6a13", weight: 4.5, opacity: 0.95, lineCap: "round", lineJoin: "round" }).addTo(map);

      // milestones: origin, checkpoints, destination
      geo.stops.forEach((st) => {
        const reached = st.at <= geo.p0 + 1e-4;
        const cls = st.kind === "origin" ? "start" : st.kind === "destination" ? (geo.delivered ? "end done" : "end") : reached ? "done" : "todo";
        const inner = st.kind === "origin" ? "" : st.kind === "destination" ? FLAG : reached ? CHECK : String(st.index);
        L.marker([st.lat, st.lon], {
          icon: L.divIcon({ className: "tv-pinwrap", html: `<span class="tv-pin ${cls}">${inner}</span>`, iconSize: [24, 24], iconAnchor: [12, 12] }),
          keyboard: false,
        })
          .bindTooltip(esc(st.name), { permanent: true, direction: "top", offset: [0, -12], className: "tv-tag", opacity: 1 })
          .addTo(map);
      });

      // the vehicle: a marker that is not snapped to whole pixels, so it glides instead of ticking
      const Smooth = (L.Marker as unknown as { extend: (o: { update: (this: Internal) => Internal }) => new (ll: Lf.LatLngExpression, o?: Lf.MarkerOptions) => Lf.Marker }).extend({
        update(this: Internal) {
          if (this._icon && this._map) this._setPos(this._map.latLngToLayerPoint(this._latlng));
          return this;
        },
      });
      const vehicle = new Smooth(pointAt(geo, latest.current.progress), {
        icon: L.divIcon({
          className: "tv-vehwrap",
          html: `<div class="tv-veh${geo.delivered ? " still" : ""}"><i class="tv-ping"></i><span class="tv-vico">${VEHICLE[s.mode]}</span><span class="tv-km"></span></div>`,
          iconSize: [46, 46],
          iconAnchor: [23, 23],
        }),
        zIndexOffset: 1000,
        interactive: false,
        keyboard: false,
      }).addTo(map);

      const update = (p: number) => {
        const ll = pointAt(geo, p);
        const sp = splitAt(geo, p);
        vehicle.setLatLng(ll);
        const km = vehicle.getElement()?.querySelector<HTMLElement>(".tv-km");
        if (km) km.textContent = `${Math.round(geo.total * p).toLocaleString("en-US")} km covered`;
        done.setLatLngs(sp.done);
        rest.setLatLngs(sp.rest);
        if (s.mode === "air") {
          const ico = vehicle.getElement()?.querySelector<HTMLElement>(".tv-vico");
          if (ico) ico.style.transform = `rotate(${bearing(ll, pointAt(geo, Math.min(p + 0.01, 1)))}deg)`;
        }
      };
      update(latest.current.progress);

      const ro = new ResizeObserver(() => map.invalidateSize());
      ro.observe(el.current);

      api.current = {
        update,
        setLayer: (l) => {
          if (l === current) return;
          map.removeLayer(layers[current]);
          layers[l].addTo(map);
          current = l;
        },
        fly: (ll) => map.flyTo(ll, Math.max(map.getZoom(), 5), { duration: 1.1 }),
      };
      cleanup = () => {
        ro.disconnect();
        api.current = null;
        map.remove();
      };
    })();

    return () => {
      dead = true;
      cleanup();
    };
  }, [s, geo]);

  useEffect(() => { api.current?.update(progress); }, [progress]);
  useEffect(() => { api.current?.setLayer(layer); }, [layer]);
  useEffect(() => { if (focus) api.current?.fly(focus.ll); }, [focus]);

  return (
    <div ref={el} className="tv-map" role="application" aria-label="Shipment route map">
      <span className="tv-loading">Loading map...</span>
    </div>
  );
}
