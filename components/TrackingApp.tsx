"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { addRecent, useConsent, useRecent } from "@/lib/cookies";
import type { Shipment } from "@/lib/shipments";
import TrackView from "./TrackView";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "found"; shipment: Shipment }
  | { kind: "missing"; number: string }
  | { kind: "error"; message: string };

async function fetchState(number: string): Promise<State> {
  try {
    const res = await fetch(`/api/track?number=${encodeURIComponent(number)}`);
    const json = await res.json().catch(() => ({}));
    if (res.status === 404) return { kind: "missing", number };
    if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong. Please try again.");
    return { kind: "found", shipment: json.shipment };
  } catch (e) {
    return { kind: "error", message: e instanceof Error ? e.message : "Something went wrong. Please try again." };
  }
}

export default function TrackingApp() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const top = useRef<HTMLElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const consent = useConsent();
  const recent = useRecent();

  const search = useCallback((raw: string) => {
    const number = raw.trim();
    if (!number) { setState({ kind: "error", message: "Please enter your tracking number." }); return; }
    setState({ kind: "loading" });
    fetchState(number).then((next) => {
      setState(next);
      if (next.kind !== "found") return;
      addRecent(number);
      window.history.replaceState(null, "", `/tracking?tracking=${encodeURIComponent(number)}`);
      setTimeout(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    });
  }, []);

  // /tracking?tracking=XYZ (from the call-to-action and footer forms) searches straight away
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("tracking")?.trim();
    if (!q) return;
    if (input.current) input.current.value = q;
    let live = true;
    fetchState(q).then((next) => {
      if (!live) return;
      setState(next);
      if (next.kind === "found") addRecent(q);
    });
    return () => { live = false; };
  }, []);

  const onSubmit = (e: FormEvent) => { e.preventDefault(); search(input.current?.value ?? ""); };
  const reset = () => { setState({ kind: "idle" }); window.history.replaceState(null, "", "/tracking"); };

  return (
    <section className="ab tk-sec" id="track" ref={top}>
      {state.kind === "found" ? (
        <TrackView s={state.shipment} onBack={reset} />
      ) : (
        <>
          <div className="tk-panel">
            <Image className="tk-panel-bg" src="/images/svc-hero2.jpg" alt="" fill sizes="(max-width:1240px) 100vw, 1240px" />
            <div className="tk-panel-in">
              <span className="tk-label">Live tracking</span>
              <h2>Where is your cargo right now?</h2>

              <form className="tk-search" onSubmit={onSubmit} role="search">
                <input ref={input} type="text" name="tracking" defaultValue="" placeholder="Enter your tracking number" aria-label="Tracking number" autoComplete="off" />
                <button type="submit" disabled={state.kind === "loading"}>{state.kind === "loading" ? "Searching..." : "Track"}</button>
              </form>

              {consent === "accepted" && recent.length > 0 && (
                <p className="tk-hints">
                  Recent:
                  {recent.map((n) => (
                    <button key={n} type="button" onClick={() => { if (input.current) input.current.value = n; search(n); }}>{n}</button>
                  ))}
                </p>
              )}

              <ul className="tk-checks">
                <li>No account needed</li>
                <li>Live map and timeline</li>
                <li>Email updates at every step</li>
              </ul>
            </div>
          </div>

          {state.kind === "missing" && (
            <div className="tk-card tk-miss" role="alert">
              <h3>We could not find &ldquo;{state.number}&rdquo;</h3>
              <p>Check the number for typos and try again. New shipments can take a few hours to appear. If it still does not show, our team will gladly help.</p>
              <a className="tk-link" href="/contact">Contact us</a>
            </div>
          )}
          {state.kind === "error" && <p className="tk-error" role="alert">{state.message}</p>}
        </>
      )}
    </section>
  );
}
