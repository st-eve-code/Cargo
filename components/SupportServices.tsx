import Image from "next/image";
import { Ic, type IconName } from "./svIcons";

const cards: { n: IconName; t: string; d: string }[] = [
  { n: "doc", t: "Customs Clearance", d: "Documentation and clearance handled by specialists, so cargo never waits at the border." },
  { n: "shield", t: "Cargo Insurance", d: "Protection for your shipment at every stage of transport." },
  { n: "pin", t: "Live Tracking", d: "Real-time GPS updates and a live timeline for every shipment." },
  { n: "support", t: "24/7 Support", d: "A dedicated team available around the clock, every day of the year." },
];

export default function SupportServices() {
  return (
    <section className="sv-sup">
      <Image src="/images/sea.jpg" alt="" fill sizes="100vw" />
      <div className="sv-sup-in">
        <p className="sv-sup-eyebrow">Support services</p>
        <h2>Additional Services</h2>
        <div className="sv-sup-grid">
          {cards.map((c) => (
            <article key={c.t}>
              <span className="sv-sup-ico"><Ic n={c.n} /></span>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
              <a href="#contact">Learn more <i>→</i></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
