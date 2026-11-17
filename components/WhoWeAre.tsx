import Image from "next/image";
import { Tick } from "./AboutStory";

const points = [
  "Reliable delivery for a connected world",
  "Sustainable, low-emission transport",
  "Improving access to global trade",
];

export default function WhoWeAre() {
  return (
    <section className="ab ab-who">
      <div className="ab-who-panel">
        <small>Who We Are</small>
        <h2>Providing affordable and reliable logistics</h2>
        <p>From first mile to final delivery, our teams combine local expertise with a global network, so your cargo arrives on time, in good condition and at a fair price.</p>

        <div className="ab-who-row">
          <div className="ab-badge">
            <i>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="5" /><path d="m8.8 13.2-1.3 7 4.5-2.4 4.5 2.4-1.3-7" /></svg>
            </i>
            We&rsquo;re No.1 Freight &amp; Logistics Partner
          </div>
          <div>
            <ul className="ab-checks tight">
              {points.map((t) => <li key={t}><Tick />{t}</li>)}
            </ul>
            <a className="ab-btn" href="#">Read More</a>
          </div>
        </div>
      </div>

      <div className="ab-who-photo">
        <Image src="/images/who.jpg" alt="Freight train" fill sizes="(max-width:900px) 100vw, 560px" />
        {/* Wire this button to your video if you have one. */}
        <button className="ab-play" type="button" aria-label="Play video">
          <svg width="18" height="18" viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 1.2 8.6 5 2.5 8.8z" fill="currentColor" /></svg>
        </button>
      </div>
    </section>
  );
}
