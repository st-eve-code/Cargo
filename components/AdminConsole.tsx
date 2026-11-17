"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminOrder } from "@/lib/orders";
import { SERVICES, STATUSES, WEIGHT_UNITS, parseOrderInput, type OrderInput } from "@/lib/orderOptions";

type Form = {
  status: string;
  service: string;
  fromAddress: string;
  toAddress: string;
  eta: string;
  weightValue: string;
  weightUnit: string;
  packages: string;
};

const EMPTY: Form = {
  status: STATUSES[0].label,
  service: SERVICES[0].label,
  fromAddress: "",
  toAddress: "",
  eta: "",
  weightValue: "",
  weightUnit: "kg",
  packages: "1",
};

const toForm = (i: OrderInput): Form => ({
  status: i.status,
  service: i.service,
  fromAddress: i.fromAddress,
  toAddress: i.toAddress,
  eta: i.eta,
  weightValue: String(i.weightValue),
  weightUnit: i.weightUnit,
  packages: String(i.packages),
});

type Json = { ok?: boolean; error?: string; number?: string };

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  }
}

export default function AdminConsole({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const [form, setForm] = useState<Form>(EMPTY);
  const [editing, setEditing] = useState<AdminOrder | null>(null);
  const [created, setCreated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (key: keyof Form) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const reset = () => {
    setEditing(null);
    setForm(EMPTY);
  };

  const shownNumber = editing?.number ?? created;

  const save = async (e: FormEvent) => {
    e.preventDefault();
    const check = parseOrderInput(form);
    if (!check.ok) {
      setMessage({ kind: "err", text: check.error });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(editing ? `/api/admin/orders/${editing.id}` : "/api/admin/orders", {
        method: editing ? "PUT" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const json: Json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setMessage({ kind: "err", text: json.error ?? "Something went wrong. Please try again." });
      } else if (editing) {
        setMessage({ kind: "ok", text: "Order updated." });
        reset();
        router.refresh();
      } else {
        setCreated(json.number ?? null);
        setCopied(false);
        setMessage({ kind: "ok", text: "Order created." });
        reset();
        router.refresh();
      }
    } catch {
      setMessage({ kind: "err", text: "Could not reach the server. Please try again." });
    }
    setBusy(false);
  };

  const removeOrder = async (o: AdminOrder) => {
    if (!window.confirm(`Delete ${o.number}? This removes the order and its tracking.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/orders/${o.id}`, { method: "DELETE" });
      const json: Json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setMessage({ kind: "err", text: json.error ?? "Could not delete the order." });
      } else {
        if (editing?.id === o.id) reset();
        if (created === o.number) setCreated(null);
        setMessage({ kind: "ok", text: "Order deleted." });
        router.refresh();
      }
    } catch {
      setMessage({ kind: "err", text: "Could not reach the server. Please try again." });
    }
    setBusy(false);
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  const edit = (o: AdminOrder) => {
    setEditing(o);
    setForm(toForm(o.input));
    setMessage(null);
  };

  const copyNumber = async () => {
    if (!shownNumber) return;
    if (await copyText(shownNumber)) setCopied(true);
  };

  return (
    <main className="ad">
      <header className="ad-top">
        <h1>Orders</h1>
        <button type="button" className="ad-ghost" onClick={logout}>Log out</button>
      </header>

      <div className="ad-grid">
        <form className="ad-card" onSubmit={save}>
          <h2>{editing ? `Edit ${editing.number}` : "New order"}</h2>

          <fieldset className="ad-set">
            <legend>Status and service</legend>
            <div className="ad-row">
              <label>Status
                <select value={form.status} onChange={set("status")}>
                  {STATUSES.map((s) => <option key={s.label} value={s.label}>{s.label}</option>)}
                </select>
              </label>
              <label>Service
                <select value={form.service} onChange={set("service")}>
                  {SERVICES.map((s) => <option key={s.label} value={s.label}>{s.label}</option>)}
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset className="ad-set">
            <legend>Addresses</legend>
            <label>From (departure address)<input type="text" maxLength={200} value={form.fromAddress} onChange={set("fromAddress")} placeholder="e.g. Lagos, Nigeria" /></label>
            <label>To (destination address)<input type="text" maxLength={200} value={form.toAddress} onChange={set("toAddress")} placeholder="e.g. Toronto, Canada" /></label>
            <p className="ad-hint">Add the city and country so the pin lands in the right place.</p>
          </fieldset>

          <fieldset className="ad-set">
            <legend>Shipment</legend>
            <div className="ad-row">
              <label>Estimated delivery<input type="date" value={form.eta} onChange={set("eta")} /></label>
              <label>Packages<input type="number" min="1" step="1" value={form.packages} onChange={set("packages")} /></label>
            </div>
            <div className="ad-row">
              <label>Weight<input type="number" min="0" step="0.01" value={form.weightValue} onChange={set("weightValue")} /></label>
              <label>Unit
                <select value={form.weightUnit} onChange={set("weightUnit")}>
                  {WEIGHT_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </label>
            </div>
          </fieldset>

          {message && <p className={`ad-msg ${message.kind}`} role="status">{message.text}</p>}

          <div className="ad-actions">
            <button type="submit" disabled={busy}>{editing ? "Save changes" : "Create order"}</button>
            {editing && <button type="button" className="ad-ghost" onClick={() => { reset(); setMessage(null); }} disabled={busy}>Cancel</button>}
          </div>
        </form>

        <div className="ad-side">
          <section className="ad-card">
            <h2>Active orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <p className="ad-muted">No active orders yet.</p>
            ) : (
              <ul className="ad-list">
                {orders.map((o) => (
                  <li key={o.id}>
                    <button type="button" className="ad-open" onClick={() => edit(o)} aria-label={`Open ${o.number}`}>
                      <b>{o.number}</b>
                      <small>{o.input.fromAddress} → {o.input.toAddress}</small>
                      <small>{o.input.status}</small>
                      <small className="ad-pin">Pinned at: {o.fromPlace} → {o.toPlace}</small>
                    </button>
                    <button type="button" className="ad-trash" onClick={() => removeOrder(o)} disabled={busy} aria-label={`Delete ${o.number}`} title="Delete order">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {shownNumber && (
            <section className="ad-card ad-number" aria-label="Tracking number">
              <small>Tracking number</small>
              <div className="ad-number-row">
                <b>{shownNumber}</b>
                <button type="button" className="ad-ghost" onClick={copyNumber}>{copied ? "Copied" : "Copy"}</button>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
