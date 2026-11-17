import Image from "next/image";

const reasons = [
  "Track & Trace",
  "Secure Warehousing",
  "Express Delivery",
  "Domestic Services",
  "Global Coverage",
  "24/7 Support",
];

/* Two-tone section: dark header band, white reasons area. The trucks cut-out straddles the split,
   and its wrapper carries the same split (70.83%) so the colours always meet at the right row. */
export default function WhyChoose() {
  return (
    <section className="why" id="why">
      <div className="why-top">
        <h2>Why Choose Us</h2>
        <p className="why-intro">Trusted by thousands of customers worldwide for reliable and professional logistics solutions.</p>
      </div>

      <div className="why-trucks">
        <Image src="/images/trucks.png" alt="Our fleet" width={2811} height={1316} sizes="(max-width:900px) 92vw, 62vw" />
      </div>

      <ul className="why-list">
        {reasons.map((r) => <li key={r}>{r}</li>)}
      </ul>
    </section>
  );
}
