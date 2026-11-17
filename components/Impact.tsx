import Image from "next/image";

const cards = [
  { t: "Delivery Performance", v: "99.8%", l: "On-Time Delivery", d: "Industry-leading on-time delivery performance across all shipping methods" },
  { t: "Tracking Precision", v: "Real-time", l: "GPS Accuracy", d: "Advanced tracking systems with minute-by-minute updates and GPS precision" },
  { t: "Client Satisfaction", v: "4.9/5", l: "Average Rating", d: "Outstanding client satisfaction across all our logistics services" },
];

export default function Impact() {
  return (
    <section className="im" id="impact">
      <div className="im-in">
        <div className="im-main">
          <h2>Our Impact &amp; Achievements</h2>
          <p className="im-lead">Delivering excellence across the globe with industry-leading standards.</p>
          <p className="im-body">
            With <b>11+ years</b> of industry experience, <b>ISO 27001</b> security certification and <b>8+ awards</b> for industry recognition, we have delivered <b>101,273+</b> packages for <b>16,714+</b> happy clients across <b>160+</b> countries, covering <b>673,754+ KM</b> every year.
          </p>
          <div className="im-cards">
            {cards.map((c) => (
              <article className="im-card" key={c.t}>
                <small>{c.t}</small>
                <strong>{c.v}</strong>
                <em>{c.l}</em>
                <p>{c.d}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="im-person">
          <Image src="/images/lady.png" alt="Delivery lady with boxes" width={1312} height={1199} sizes="(max-width:1000px) 72vw, 34vw" />
        </div>
      </div>
    </section>
  );
}
