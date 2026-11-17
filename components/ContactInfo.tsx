import Image from "next/image";
import { site } from "@/lib/site";

/* % positions on the world-dots map (equirectangular, lon -180..180, lat 78..-58). */
const pins = [
  [29.4, 27.4], [17.2, 32.4], [37.1, 74.6], [50.0, 19.5], [50.9, 52.6], [57.8, 76.6],
  [65.4, 38.8], [70.2, 43.4], [78.8, 56.4], [83.8, 34.4], [88.8, 31.1], [92.0, 82.3],
];

export default function ContactInfo() {
  return (
    <section className="ab cn-info" id="reach">
      <span className="cn-mark" aria-hidden="true">CONTACT</span>
      <div className="cn-info-head">
        <h2>Get in touch</h2>
        <p>Prefer to talk? Call, email or visit us.</p>
      </div>

      <div className="cn-info-grid">
        <dl className="cn-list">
          <div><dt>Office address</dt><dd>{site.address}</dd></div>
          <div><dt>Phone</dt><dd><a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>{site.phone}</a></dd></div>
          <div><dt>Email</dt><dd><a href={`mailto:${site.email}`}>{site.email}</a></dd></div>
          <div><dt>Working hours</dt><dd>{site.hours}</dd></div>
        </dl>

        <div className="ab-map" aria-hidden="true">
          <Image src="/images/world-dots.webp" alt="" fill sizes="(max-width:900px) 100vw, 640px" />
          {pins.map(([x, y]) => <i className="ab-pin" key={`${x}-${y}`} style={{ left: `${x}%`, top: `${y}%` }} />)}
        </div>
      </div>
    </section>
  );
}
