import Image from "next/image";
import { Ic, type IconName } from "./svIcons";

type Item = { n: IconName; t: string; d: string };

const left: Item[] = [
  { n: "air", t: "Air Freight", d: "Fast, reliable air cargo to every major hub, with priority handling and live tracking." },
  { n: "ocean", t: "Ocean Freight", d: "Full and shared container shipping across the world's main sea lanes." },
];
const right: Item[] = [
  { n: "road", t: "Road Transportation", d: "Door-to-door trucking with a modern fleet, domestic and cross-border." },
  { n: "warehouse", t: "Warehousing", d: "Secure, monitored storage with inventory control and flexible terms." },
];

const Col = ({ items }: { items: Item[] }) => (
  <div className="sv-help-col">
    {items.map((i) => (
      <article className="sv-help-item" key={i.t}>
        <span className="sv-help-ico"><Ic n={i.n} /></span>
        <h3>{i.t}</h3>
        <p>{i.d}</p>
        <a href="#contact">Learn more <i>→</i></a>
      </article>
    ))}
  </div>
);

export default function ServicesHelp() {
  return (
    <section className="sv-help" id="solutions">
      <p className="sv-eyebrow"><span>Our services</span></p>
      <h2>We&rsquo;re Always Ready to Help You</h2>
      <div className="sv-help-grid">
        <Col items={left} />
        <div className="sv-help-img">
          <Image src="/images/svc-help.jpg" alt="Handler carrying a box" width={470} height={807} sizes="(max-width:900px) 60vw, 340px" />
        </div>
        <Col items={right} />
      </div>
    </section>
  );
}
