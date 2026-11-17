const steps = [
  { n: "01", t: "Request a Quote", d: "Tell us what you ship, where from and where to. We reply with a clear price." },
  { n: "02", t: "Pickup & Packing", d: "We collect your cargo, pack it safely and prepare every document." },
  { n: "03", t: "Transit & Tracking", d: "Your shipment moves by air, sea or road, with live tracking all the way." },
  { n: "04", t: "Safe Delivery", d: "Delivered to the door on schedule, with confirmation and proof of delivery." },
];

export default function ProcessSteps() {
  return (
    <section className="sv-proc">
      <p className="sv-eyebrow"><span>Our process</span><i /></p>
      <h2>Fast And Controlled<br />Shipments Process</h2>
      <p className="sv-proc-lead">Four simple steps take your cargo from a quote request to a confirmed delivery, with a real person you can reach at every stage.</p>
      <ol className="sv-steps">
        {steps.map((s) => (
          <li key={s.n}>
            <b>{s.n}</b>
            <div><h3>{s.t}</h3><p>{s.d}</p></div>
          </li>
        ))}
      </ol>
    </section>
  );
}
