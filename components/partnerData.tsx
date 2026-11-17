import Image from "next/image";
import type { ReactNode } from "react";

/* Placeholder wordmarks. To use a real, verified partner logo: drop the file in public/logos/
   and add `src: "/logos/name.svg"` to that entry. The text mark is then replaced by the image. */
export type Partner = { name: string; cls: string; icon?: ReactNode; src?: string };

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const partners: Partner[] = [
  { name: "Northwind", cls: "wm-a", icon: <circle cx="12" cy="12" r="8" {...stroke} strokeWidth={2.6} /> },
  { name: "Aerolink", cls: "wm-b", icon: <path d="M3 18 12 5l9 13M7 18l5-7 5 7" {...stroke} /> },
  { name: "vantage", cls: "wm-c", icon: <rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" /> },
  { name: "Orbitex", cls: "wm-d", icon: <><circle cx="12" cy="12" r="3.2" fill="currentColor" /><ellipse cx="12" cy="12" rx="10" ry="4.5" {...stroke} strokeWidth={1.8} transform="rotate(-25 12 12)" /></> },
  { name: "Marlow & Co", cls: "wm-e" },
  { name: "Swiftline", cls: "wm-f", icon: <path d="M13 3 6 13h5l-1 8 8-11h-5z" fill="currentColor" /> },
  { name: "Blueport", cls: "wm-g", icon: <path d="M2 14c3-4 5-4 8 0s5 4 8 0 3-3 4-2" {...stroke} /> },
  { name: "Cargoflex", cls: "wm-h", icon: <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z" {...stroke} /> },
  { name: "Skyroute", cls: "wm-a", icon: <path d="M3 17 21 7M15 6h6v6" {...stroke} /> },
  { name: "TransAtlas", cls: "wm-c", icon: <><circle cx="12" cy="12" r="9" {...stroke} strokeWidth={1.8} /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" {...stroke} strokeWidth={1.4} /></> },
  { name: "Kestrel Express", cls: "wm-f" },
  { name: "Primeway", cls: "wm-g", icon: <path d="M4 12h14M13 6l6 6-6 6" {...stroke} /> },
];

export function Wordmark({ p }: { p: Partner }) {
  if (p.src) return <Image src={p.src} alt={p.name} width={140} height={40} />;
  return (
    <span className={`wm ${p.cls}`}>
      {p.icon && <svg viewBox="0 0 24 24" aria-hidden="true">{p.icon}</svg>}
      {p.name}
    </span>
  );
}
