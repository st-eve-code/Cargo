import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/* The image shared when a page of the website is posted on social media (1200 x 630). */
export const alt = `${site.name}: freight transport and logistics`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "#0d1424", color: "#ffffff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="64" height="64" viewBox="0 0 24 24">
            <rect x="1" y="7" width="9" height="9" rx="3" fill="#ff6a13" />
            <rect x="8" y="1" width="9" height="9" rx="3" fill="#ffffff" />
            <rect x="14" y="14" width="9" height="9" rx="3" fill="#ff6a13" />
            <rect x="7" y="14" width="9" height="9" rx="3" fill="#ffffff" opacity="0.75" />
          </svg>
          <div style={{ fontSize: 40, fontWeight: 700 }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>Freight transport &amp; logistics</div>
          <div style={{ fontSize: 30, color: "#ff8a4c" }}>Air, sea and road freight, with live tracking on every shipment.</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
