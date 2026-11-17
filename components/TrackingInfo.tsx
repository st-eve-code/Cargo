import { Ic } from "./svIcons";

const how = [
  { t: "Enter your number", d: "Type the tracking number from your booking confirmation. No account needed." },
  { t: "See the live status", d: "Follow your cargo on the map and in a clear timeline, from pickup to delivery." },
  { t: "Get email updates", d: "We email you at every step, so you always know where your shipment is." },
];

const faq = [
  { q: "Where can I find my tracking number?", a: "Look in your booking confirmation email. It is also printed on the receipt we sent you. If you cannot find it, reply to any of our emails and we will send it again." },
  { q: "How often is the status updated?", a: "Each time your shipment goes through a checkpoint, like pickup, a transit hub, the border or the final delivery, we record it. The timeline shows the time of every scan." },
  { q: "My tracking number is not found. What should I do?", a: "Double-check it for typos and try again. A brand-new shipment can take a few hours to show up. If it still does not appear after that, get in touch and we will look into it for you." },
  { q: "Can I track more than one shipment?", a: "Yes. Search for one number at a time in the box above. Each shipment opens with its own map and details." },
];

const icons = ["doc", "pin"] as const;

export default function TrackingInfo() {
  return (
    <>
      <section className="ab tk-how">
        <h2>Tracking made simple</h2>
        <ul>
          {how.map((h, i) => (
            <li key={h.t}>
              <span className="tk-ico">
                {i < 2 ? <Ic n={icons[i]} /> : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></svg>
                )}
              </span>
              <h3>{h.t}</h3>
              <p>{h.d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="ab tk-faq-sec">
        <h2>Tracking questions</h2>
        <div className="tk-faq">
          {faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
