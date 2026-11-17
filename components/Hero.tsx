"use client";

import Image from "next/image";
import { useState } from "react";

const tabs = ["1 Rail freight", "2 Road transport", "3 Sea freight"];

export default function Hero() {
  const [tab, setTab] = useState(0);

  return (
    <section className="hero">
      <Image src="/images/hero.jpg" alt="" fill priority sizes="100vw" className="hero-bg" />
      <div className="hero-shade" />


      {/* COPY */}
      <div className="hero-copy">
        <h1>Full service in<br />freight transport</h1>
        <p>Railway transportation solutions is not only particularly sustainable, but is also fast and cost effective.</p>
      </div>

      {/* BOTTOM ROW */}
      <div className="hero-bottom">
        <div className="call">
          <div className="who">
            <Image src="/images/avatar.jpg" alt="Lindsey Herwitz" width={52} height={52} />
            <div><strong>Lindsey Herwitz</strong><small>Call manager</small></div>
          </div>
          <a className="cta-y" href="#">Get a free freight settlement
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M2 8 8 2M3.5 2H8v4.5" /></svg>
          </a>
        </div>

        <div className="tabs">
          {tabs.map((t, i) => (
            <button key={t} type="button" className={i === tab ? "on" : undefined} onClick={() => setTab(i)}>
              <span>{t}</span><i />
            </button>
          ))}
        </div>

        <div className="stat">
          <Image src="/images/stat.jpg" alt="" width={120} height={131} />
          <div className="stat-r">
            <b>7000+</b>
            <div className="chips"><span>Transport</span><span>in our partner network</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
