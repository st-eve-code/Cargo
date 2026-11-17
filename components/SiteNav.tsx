"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About us", href: "/about" },
  { label: "Tracking", href: "/tracking" },
  { label: "Contact us", href: "#contact" },
];

/* THE navbar: used unchanged on every page (home, services, about, ...). */
export default function SiteNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const cls = (href: string) => (href === path ? "on" : undefined);

  return (
    <header className="sn">
      <div className="sn-in">
        <Link className="sn-logo" href="/">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="1" y="7" width="9" height="9" rx="3" fill="#ff6a13" /><rect x="8" y="1" width="9" height="9" rx="3" fill="#0d1424" />
            <rect x="14" y="14" width="9" height="9" rx="3" fill="#ff6a13" /><rect x="7" y="14" width="9" height="9" rx="3" fill="#0d1424" opacity=".75" />
          </svg>
          {site.name}
        </Link>

        <nav className="sn-links" aria-label="Main">
          {links.map((l) => <a key={l.label} href={l.href} className={cls(l.href)}>{l.label}</a>)}
        </nav>

        <a className="sn-cta" href="/request-quote">Get a quote</a>

        <button className="sn-burger" type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M2 5h14M2 9h14M2 13h14" /></svg>
        </button>
      </div>

      <div className={`sn-sheet${open ? " open" : ""}`}>
        {links.map((l) => <a key={l.label} href={l.href} className={cls(l.href)} onClick={() => setOpen(false)}>{l.label}</a>)}
        <a className="sn-cta" href="/request-quote">Get a quote</a>
      </div>
    </header>
  );
}
