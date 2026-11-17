import Image from "next/image";

/* % positions on the world-dots map (equirectangular, lon -180..180, lat 78..-58). */
const pins = [
  [29.4, 27.4], [17.2, 32.4], [37.1, 74.6], [50.0, 19.5], [50.9, 52.6], [57.8, 76.6],
  [65.4, 38.8], [70.2, 43.4], [78.8, 56.4], [83.8, 34.4], [88.8, 31.1], [92.0, 82.3],
];

const stats = [
  { n: "25+", l: "Years of Experience" },
  { n: "77", l: "Offices Worldwide" },
  { n: "38K", l: "Workers Employed" },
];

export default function SpreadWorld() {
  return (
    <section className="ab ab-world">
      <div className="ab-map" aria-hidden="true">
        <Image src="/images/world-dots.webp" alt="" fill sizes="(max-width:900px) 100vw, 640px" />
        {pins.map(([x, y]) => <i className="ab-pin" key={`${x}-${y}`} style={{ left: `${x}%`, top: `${y}%` }} />)}
      </div>

      <div>
        <h2>We Spread Around<br />The World</h2>
        <p>With offices and partners on every continent, we can collect, move and deliver your cargo wherever your customers are, with one team and one tracking number from start to finish.</p>
        <div className="ab-stats">
          {stats.map((s) => <div key={s.l}><b>{s.n}</b><span>{s.l}</span></div>)}
        </div>
      </div>
    </section>
  );
}
