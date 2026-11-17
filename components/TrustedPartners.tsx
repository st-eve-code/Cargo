import { partners, Wordmark } from "./partnerData";

const Tick = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.5 6.3 5 8.8l4.5-5.2" />
  </svg>
);

export default function TrustedPartners() {
  return (
    <section className="tp" id="trusted">
      <div className="tp-in">
        <header className="tp-head">
          <h2>Trusted Partners</h2>
          <p>Working with industry leaders to provide the best logistics solutions</p>
        </header>

        <ul className="tp-grid">
          {partners.map((p) => (
            <li className="tp-tile" key={p.name}>
              <Wordmark p={p} />
              <span className="tp-tick" aria-label="Verified"><Tick /></span>
            </li>
          ))}
        </ul>

        <p className="tp-legend"><span className="tp-tick"><Tick /></span> Verified courier partner</p>
      </div>
    </section>
  );
}
