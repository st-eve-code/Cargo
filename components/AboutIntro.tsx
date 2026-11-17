import Image from "next/image";
import { site } from "@/lib/site";

export default function AboutIntro() {
  return (
    <section className="ab ab-intro">
      <div className="ab-top">
        <h1>About Us</h1>
        <p>We simplify global shipping with modern technology, reliable networks, and smart logistics solutions built around your business.</p>
      </div>

      {/* The photo's original logo was removed; the brand name below is live text positioned on the container. */}
      <div className="ab-hero">
        <Image src="/images/about-hero.jpg" alt={`${site.shortName} truck and container`} fill priority sizes="(max-width:1240px) 100vw, 1240px" />
        <div className="ab-brand">
          <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
            <rect x="1" y="7" width="9" height="9" rx="3" /><rect x="8" y="1" width="9" height="9" rx="3" />
            <rect x="14" y="14" width="9" height="9" rx="3" /><rect x="7" y="14" width="9" height="9" rx="3" opacity=".7" />
          </svg>
          {site.shortName}
        </div>
      </div>
    </section>
  );
}
