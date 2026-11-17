import Image from "next/image";

/* Photo hero. The navbar is the shared SiteNav (rendered by the page), so this is just the hero. */
export default function ServicesHero() {
  return (
    <section className="sh">
      <Image className="sh-bg" src="/images/svc-hero2.jpg" alt="" fill priority sizes="100vw" />
      <div className="sh-in">
        <h1>Reliable Transportation &amp; Logistics Solutions</h1>
        <p>Fast, secure, and efficient freight services tailored to your business needs. From local delivery to global supply chain, we move what matters.</p>
        <div className="sh-btns">
          <a className="sh-btn" href="/request-quote">Get a Quote</a>
          <a className="sh-btn ghost" href="/tracking">Track Shipment</a>
        </div>
      </div>
    </section>
  );
}
