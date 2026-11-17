"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildGeo, pointAt, type LL } from "@/lib/geo";
import type { Shipment } from "@/lib/shipments";
import TrackMap, { type Focus, type Layer } from "./TrackMap";

/* demo: share of the whole route covered per second at full speed. Set NEXT_PUBLIC_VEHICLE_SPEED in .env (restart the server after changing it). */
const SPEED = Number(process.env.NEXT_PUBLIC_VEHICLE_SPEED) > 0 ? Number(process.env.NEXT_PUBLIC_VEHICLE_SPEED) : 0.0015;
const CYCLE_S = 90; // seconds for one slowdown cycle: traffic, checks and weather make the speed rise and fall
const W = (2 * Math.PI) / CYCLE_S;
/* distance covered after e seconds when the speed varies between 75% and 100% of full speed */
const covered = (e: number) => 0.875 * e - (0.125 * (1 - Math.cos(W * e))) / W;
const fmtKm = (n: number) => `${Math.round(n).toLocaleString("en-US")} km`;
const fmtKmExact = (n: number) => `${n.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;

type Tab = "route" | "details";

function useLiveProgress(p0: number, cap: number, still: boolean) {
  const [p, setP] = useState(p0);
  const [base, setBase] = useState({ p0, cap, still });
  if (base.p0 !== p0 || base.cap !== cap || base.still !== still) {
    setBase({ p0, cap, still });
    setP(p0);
  }
  useEffect(() => {
    if (still || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t0 = performance.now();
    const id = window.setInterval(() => {
      const next = Math.min(p0 + SPEED * covered((performance.now() - t0) / 1000), cap);
      setP(next);
      if (next >= cap) window.clearInterval(id);
    }, 100);
    return () => window.clearInterval(id);
  }, [p0, cap, still]);
  return p;
}

const Chevron = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
);

const ArriveIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3v18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /><path d="M6 4h12l-3 4 3 4H6z" fill="currentColor" /></svg>
);

export default function TrackView({ s, onBack }: { s: Shipment; onBack: () => void }) {
  const geo = useMemo(() => buildGeo(s), [s]);
  const p = useLiveProgress(geo.p0, geo.cap, geo.delivered);
  const [open, setOpen] = useState(() => window.innerWidth >= 900);
  const [tab, setTab] = useState<Tab>("route");
  const [layer, setLayer] = useState<Layer>("map");
  const [focus, setFocus] = useState<Focus | null>(null);
  const focusCount = useRef(0);

  const pct = Math.round(p * 100);
  const left = geo.total * (1 - p);
  const end = geo.stops[1];
  const flyTo = (ll: LL) => {
    focusCount.current += 1;
    setFocus({ ll, n: focusCount.current });
  };

  const details: [string, string][] = [
    ["Status", s.status],
    ["Service", s.service],
    ["From", s.from],
    ["To", s.to],
    ["Distance", fmtKm(geo.total)],
    ["Weight", s.weight],
    ["Packages", String(s.packages)],
    [geo.delivered ? "Delivered" : "Estimated delivery", s.eta.replace("Delivered ", "")],
  ];

  return (
    <div className="tv" data-open={open}>
      <header className="tv-bar">
        <button className="tv-back" type="button" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 8H3m5-5L3 8l5 5" /></svg>
          <span>Track another</span>
        </button>
        <div className="tv-title">
          <b>{s.number}</b>
          <small>{s.from} → {s.to}</small>
        </div>
        <span className={`tv-badge${geo.delivered ? " ok" : ""}`}>{s.status}</span>
      </header>

      <div className="tv-body">
        <aside className="tv-panel" id="tv-panel">
          <div className="tv-panel-in">
            <div className="tv-tabs" role="tablist">
              {(["route", "details"] as Tab[]).map((t) => (
                <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "on" : undefined} onClick={() => setTab(t)}>
                  {t === "route" ? "Route" : "Details"}
                </button>
              ))}
            </div>

            {tab === "route" && (
              <div className="tv-dest">
                <button type="button" className="tv-dest-ico" aria-label={`Show destination: ${s.to}`} onClick={() => flyTo([end.lat, end.lon])}>
                  <ArriveIcon />
                </button>
                <small>{geo.delivered ? "Delivered to" : "Destination"}</small>
                <b>{s.to}</b>
                <div className="tv-dest-km">
                  <span>{fmtKmExact(left)}</span>
                  <small>{geo.delivered ? "arrived" : "to go"}</small>
                </div>
              </div>
            )}

            {tab === "details" && (
              <dl className="tv-details">
                {details.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
              </dl>
            )}

            <p className="tv-help">Need help? <a href="/contact">Contact us</a></p>
          </div>
        </aside>

        <div className="tv-mapwrap">
          <TrackMap s={s} geo={geo} progress={p} layer={layer} focus={focus} />

          <div className="tv-float">
            <div className="tv-card">
              <button className="tv-toggle" type="button" aria-expanded={open} aria-controls="tv-panel" onClick={() => setOpen((v) => !v)}>
                <Chevron />
                <span className="sr-only">{open ? "Hide details" : "Show details"}</span>
              </button>
              <div className="tv-card-i">
                <small>{geo.delivered ? "Delivered to" : "En route to"}</small>
                <b>{s.to}</b>
              </div>
              <div className="tv-meter">
                <span><b>{pct}%</b> {geo.delivered ? "complete" : `· ${fmtKm(left)} left`}</span>
                <i><u style={{ width: `${pct}%` }} /></i>
              </div>
            </div>
          </div>

          <div className="tv-tools">
            <div className="tv-seg" role="group" aria-label="Map type">
              <button type="button" className={layer === "map" ? "on" : undefined} onClick={() => setLayer("map")}>Map</button>
              <button type="button" className={layer === "sat" ? "on" : undefined} onClick={() => setLayer("sat")}>Satellite</button>
            </div>
            <button className="tv-locate" type="button" onClick={() => flyTo(pointAt(geo, p))}>Locate shipment</button>
          </div>
        </div>
      </div>
    </div>
  );
}
