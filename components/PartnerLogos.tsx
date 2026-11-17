import { partners, Wordmark } from "./partnerData";

export default function PartnerLogos() {
  return (
    <section className="pl" id="partners">
      <p>Partners of world leading companies</p>
      <ul>
        {partners.slice(0, 5).map((p) => (
          <li key={p.name}><Wordmark p={p} /></li>
        ))}
      </ul>
    </section>
  );
}
