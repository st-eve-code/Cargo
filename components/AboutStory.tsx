import Image from "next/image";
import { site } from "@/lib/site";

const points = [
  "Track and manage every shipment in one place",
  "Real-time visibility across your entire supply chain",
  "API integrations for seamless connectivity",
  "Intelligent dashboards for smarter logistics decisions",
];

export const Tick = () => (
  <span className="ab-tick">
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 6.3 5 8.8l4.5-5.2" /></svg>
  </span>
);

export default function AboutStory() {
  return (
    <section className="ab ab-story">
      <div>
        <span className="ab-eyebrow">About us</span>
        <h2>Built to Move<br />Business Forward</h2>
        <p>{site.shortName} started with a simple goal: make logistics easier, faster, and more transparent for businesses of every size.</p>
        <p>Over the years, we&rsquo;ve built a trusted logistics network powered by technology, experienced teams, and reliable global partners. From local deliveries to international freight, we help businesses move goods with confidence.</p>
        <ul className="ab-checks">
          {points.map((t) => <li key={t}><Tick />{t}</li>)}
        </ul>
      </div>
      <div className="ab-photo">
        <Image src="/images/about-truck.jpg" alt="Freight truck on the road" fill sizes="(max-width:900px) 100vw, 600px" />
      </div>
    </section>
  );
}
