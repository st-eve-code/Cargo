import Image from "next/image";
import { site } from "@/lib/site";

/* Placeholder testimonial: replace the quote, name and role with a real client. */
export default function ServicesTestimonial() {
  return (
    <section className="sv-test">
      <div className="sv-quote">
        <svg width="64" height="52" viewBox="0 0 64 52" fill="#fff" aria-hidden="true"><path d="M0 52V28C0 12 8 3 24 0v10C16 12 13 17 13 24h11v28zM36 52V28c0-16 8-25 24-28v10c-8 2-11 7-11 14h11v28z" /></svg>
        <p>I am very happy with the services because {site.shortName} is the <em>number 1 freight company.</em></p>
        <div className="sv-author">
          <span>CN</span>
          <div><b>Client Name</b><small>CEO, Company</small></div>
          <i className="sv-dots" aria-hidden="true"><u className="on" /><u /><u /><u /><u /></i>
        </div>
      </div>
      <div className="sv-test-photo">
        <Image src="/images/svc-test.jpg" alt="Smiling delivery team member" fill sizes="(max-width:900px) 100vw, 50vw" />
        <div className="sv-test-stats">
          <div><b>11+</b><span>Years Experience</span></div>
          <div><b>8+</b><span>Awards Won</span></div>
        </div>
      </div>
    </section>
  );
}
