const people = [
  { i: "AK", c: "#1d1d1d" },
  { i: "MT", c: "#b8401a" },
  { i: "JS", c: "#3b6ea8" },
  { i: "LH", c: "#7a5a9a" },
];

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12 12 4M5.5 4H12v6.5" />
  </svg>
);

function Card({ variant }: { variant: "d" | "m" }) {
  return (
    <div className={`sc-card ${variant}`}>
      <h3>Explore the Future of Cargo Logistics</h3>
      <p>Real-time tracking, intelligent routing, and global freight solutions powered by advanced logistics technology.</p>
      <a className="sc-btn" href="#contact">Get Started <i><Arrow /></i></a>
    </div>
  );
}

/* About us poster. The scene is one SVG in a 656x460 coordinate space, so every piece keeps
   its exact position at any width. Cut-out photos: public/images/hang.webp + stack.webp. */
export default function AboutShowcase() {
  return (
    <section className="showcase" id="about">
      <div className="canvas">
        <h2 className="sc-giant">ABOUT US</h2>

        <svg className="scene" viewBox="0 0 656 460" aria-hidden="true">
          <image href="/images/stack.webp" x="0" y="227" width="656" height="232" />
          <g className="sway">
            <g stroke="#1d1d1d" strokeWidth="1.1" strokeLinecap="round">
              <line x1="292.5" y1="0" x2="292.5" y2="46" />
              <line x1="292.5" y1="62" x2="140" y2="153" />
              <line x1="292.5" y1="62" x2="440" y2="129" />
            </g>
            <rect x="283" y="42" width="19" height="24" rx="4.5" fill="#1d1d1d" />
            <rect x="288.5" y="60" width="8" height="9" rx="2.5" fill="#1d1d1d" />
            <image href="/images/hang.webp" x="138" y="107" width="309" height="182" />
          </g>
        </svg>

        <p className="sc-side">Trusted by global partners worldwide</p>

        <a className="sc-play" href="#about">
          <span className="ring"><span className="dot">
            <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 1.2 8.6 5 2.5 8.8z" fill="currentColor" /></svg>
          </span></span>
          <span>Discover the<br />Pioneer Cargo</span>
        </a>

        <div className="sc-proof">
          <div className="av">{people.map((p) => <span key={p.i} style={{ background: p.c }}>{p.i}</span>)}</div>
          <div><b>20K+</b><small>Global Shipments Delivered</small></div>
        </div>

        <Card variant="d" />
      </div>
      <Card variant="m" />
    </section>
  );
}
