"use client";

import { FormEvent, useState } from "react";

const services = ["Air Freight", "Ocean Freight", "Road Transportation", "Warehousing", "Packaging & Storage", "Express Delivery", "Something else"];

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm({ kind = "contact" }: { kind?: "contact" | "quote" }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    if (!data.name?.trim() || !/^\S+@\S+\.\S+$/.test(data.email ?? "") || !data.message?.trim()) {
      setStatus("error");
      setError("Please enter your name, a valid email and a message.");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, kind }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      form.reset();
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form className="cn-form" onSubmit={onSubmit} noValidate>
      <div className="cn-row"><label htmlFor="cn-name">Full name</label><input id="cn-name" name="name" type="text" autoComplete="name" required /></div>
      <div className="cn-row"><label htmlFor="cn-email">Email</label><input id="cn-email" name="email" type="email" autoComplete="email" required /></div>
      <div className="cn-row"><label htmlFor="cn-phone">Phone</label><input id="cn-phone" name="phone" type="tel" autoComplete="tel" /></div>
      <div className="cn-row">
        <label htmlFor="cn-service">Service</label>
        <select id="cn-service" name="service" defaultValue="">
          <option value="" disabled>Select a service</option>
          {services.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="cn-row top"><label htmlFor="cn-message">Message</label><textarea id="cn-message" name="message" required /></div>

      {/* spam trap: real visitors never see or fill this */}
      <input className="cn-hp" name="company" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <button className="cn-send" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send Message"}
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
      </button>

      <p className={`cn-status${status === "sent" ? " ok" : status === "error" ? " err" : ""}`} role="status" aria-live="polite">
        {status === "sent" && "Thank you! Your message was sent. We will reply within one business day."}
        {status === "error" && error}
      </p>
    </form>
  );
}
