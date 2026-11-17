import { Wordmark, type Partner } from "./partnerData";

/* Placeholder integration names — replace with real logos (add `src`). */
const items: Partner[] = [
  { name: "Cartly", cls: "wm-a" },
  { name: "Stockpilot", cls: "wm-f" },
  { name: "Ledgerly", cls: "wm-c" },
  { name: "Paywise", cls: "wm-g" },
  { name: "Dispatchr", cls: "wm-h" },
  { name: "Shipkit", cls: "wm-b" },
  { name: "Webhooked", cls: "wm-e" },
];

export default function Integrations() {
  return (
    <section className="ab ab-int">
      <h3>Integrations to supercharge your business</h3>
      <ul>{items.map((p) => <li key={p.name}><Wordmark p={p} /></li>)}</ul>
    </section>
  );
}
