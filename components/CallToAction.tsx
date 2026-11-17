import Image from "next/image";

/* Marker positions are % of the map image (equirectangular, lon -180..180, lat 78..-58). */
const pins = [
  [29.4, 27.4], [17.2, 32.4], [37.1, 74.6], [50.0, 19.5], [50.9, 52.6], [57.8, 76.6],
  [65.4, 38.8], [70.2, 43.4], [78.8, 56.4], [83.8, 34.4], [88.8, 31.1], [92.0, 82.3],
];

const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

export default function CallToAction() {
  return (
    <section className="ct" id="quote">
      <div className="ct-map" aria-hidden="true">
        <Image src="/images/world-dots.webp" alt="" fill sizes="100vw" />
        {pins.map(([x, y]) => <i className="pin" key={`${x}-${y}`} style={{ left: `${x}%`, top: `${y}%` }} />)}
      </div>

      <div className="ct-in">
        <h2>Ready to ship with <span>confidence?</span></h2>
        <p>Tell us what you are shipping and we will send you a quote.</p>

        <div className="ct-row">
          <a className="ct-btn" href="/request-quote">Get Free Quote <Arrow /></a>

          <form className="ct-track" action="/tracking" method="get">
            <input type="text" name="tracking" placeholder="Enter your tracking number" aria-label="Tracking number" />
            <button className="ct-go" type="submit" aria-label="Track shipment">Track</button>
          </form>
        </div>
      </div>
    </section>
  );
}
