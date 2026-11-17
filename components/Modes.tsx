import Image from "next/image";

const modes = [
  { name: "Rail freight", img: "rail" },
  { name: "Road transport", img: "road" },
  { name: "Sea freight", img: "sea" },
];

const Arrow = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

export default function Modes() {
  return (
    <section className="sec modes" id="services">
      <svg className="mark-p" viewBox="0 0 560 330" fill="none" stroke="#ececec" strokeWidth="1.5" aria-hidden="true">
        <path d="M270 0h180a110 110 0 0 1 0 220H270" />
        <path d="M270 0v330M95 120h175v210H95z" />
      </svg>

      <div className="aside">
        <p className="blurb">
          <i className="dots" aria-hidden="true" />
          <span>Pioneer Cargo Solutions — transport logistics with quality mark</span>
        </p>
        <svg className="big-arrow" viewBox="0 0 90 90" aria-hidden="true">
          <defs>
            <filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000" floodOpacity=".06" /></filter>
          </defs>
          <path filter="url(#sh)" fill="#f6f6f6" d="M20 8h62v62H64V38L22 80l-12-12 42-42H20z" />
        </svg>
      </div>

      <div className="head">
        <div>
          <span className="chip">Choose a mode of transport</span>
          <h2>We will select the optimal transport for any request</h2>
        </div>
        <p className="note">
          Transport company that transports cargo anywhere in the city, country and world. We offer the most convenient way of transportation, based on the requirements for speed and cost of transportation
        </p>
      </div>

      <div className="cards">
        {modes.map((m) => (
          <a className="mode" href="#" key={m.name}>
            <Image src={`/images/${m.img}.jpg`} alt={m.name} fill sizes="(max-width:900px) 100vw, 30vw" />
            <span className="mode-t">{m.name}</span>
            <span className="round"><Arrow /></span>
          </a>
        ))}
      </div>
    </section>
  );
}
