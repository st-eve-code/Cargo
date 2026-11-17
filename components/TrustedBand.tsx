import { partners, Wordmark } from "./partnerData";

export default function TrustedBand() {
  const shown = [partners[0], partners[3], partners[6]];
  return (
    <section className="ab ab-trust">
      <h3>Trusted by 30,000 world-class brands and organizations of all sizes</h3>
      <ul>{shown.map((p) => <li key={p.name}><Wordmark p={p} /></li>)}</ul>
    </section>
  );
}
