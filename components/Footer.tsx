"use client";

import Link from "next/link";
import ScrollAnimations from "./ScrollAnimations";
import { site } from "@/lib/site";

const quick = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Track Shipment", href: "/tracking" },
  { label: "Contact Us", href: "#contact" },
];

const legal = ["Privacy Policy", "Terms of Service", "Shipping Policy"];

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const social = [
  { n: "Facebook", url: site.social.facebook, d: <path d="M14 8h2V5h-2.3C11.8 5 10.5 6.3 10.5 8.2V10H8.5v3h2v6h3v-6h2.3l.4-3h-2.7V8.4c0-.3.2-.4.5-.4z" {...s} /> },
  { n: "Telegram", url: site.social.telegram, d: <path d="M20 5 3.5 11.2l5 2 1.9 5.8 2.6-3.3 4.2 3.1z" {...s} /> },
  { n: "Instagram", url: site.social.instagram, d: <><rect x="5" y="5" width="14" height="14" rx="4.5" {...s} /><circle cx="12" cy="12" r="3.2" {...s} /><circle cx="16.3" cy="7.7" r=".6" fill="currentColor" /></> },
];

export default function Footer() {
  return (
    <footer className="ft" id="contact">
      <div className="ft-in">
        <div className="ft-brand">
          <Link className="ft-logo" href="/">
            <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
              <rect x="1" y="7" width="9" height="9" rx="3" /><rect x="8" y="1" width="9" height="9" rx="3" />
              <rect x="14" y="14" width="9" height="9" rx="3" /><rect x="7" y="14" width="9" height="9" rx="3" opacity=".7" />
            </svg>
            {site.name}
          </Link>
          <p>Smart logistics across the world, backed by a global network of trusted partners and live tracking on every shipment.</p>
          <div className="ft-social">
            {social.filter((i) => i.url).map((i) => (
              <a key={i.n} href={i.url} aria-label={i.n} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true">{i.d}</svg></a>
            ))}
          </div>
        </div>

        <nav className="ft-col" aria-label="Quick links">
          <h4>Quick Links</h4>
          <ul>{quick.map((l) => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}</ul>
        </nav>

        <div className="ft-col">
          <h4>Contact Info</h4>
          <dl>
            <div><dt>Email Us</dt><dd><a href={`mailto:${site.email}`}>{site.email}</a></dd></div>
            <div><dt>Call Us</dt><dd>{site.phone}</dd></div>
            <div><dt>Working Hours</dt><dd>{site.hours}</dd></div>
          </dl>
        </div>

        <form className="ft-col ft-track" action="/tracking" method="get">
          <h4>Quick Track</h4>
          <div>
            <input type="text" name="tracking" placeholder="Tracking number" aria-label="Tracking number" />
            <button type="submit">Track</button>
          </div>
        </form>
      </div>

      <div className="ft-bar">
        <span>Copyright © {site.copyrightYear} {site.name} | All rights reserved</span>
        <ul>{legal.map((l) => <li key={l}>{l}</li>)}</ul>
      </div>
      <ScrollAnimations />
    </footer>
  );
}
