import type { Metadata } from "next";
import { Inter_Tight, Unbounded } from "next/font/google";
import "./globals.css";
import CookieNotice from "@/components/CookieNotice";
import { site } from "@/lib/site";

const font = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font" });
const display = Unbounded({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" });

const description = "Full service in freight transport: rail, road and sea freight with a quality mark.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Freight transport & logistics`, template: `%s` },
  description,
  openGraph: { siteName: site.name, description, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${font.variable} ${display.variable}`}>
      {/* Extensions may inject attributes onto <body> before React hydrates
          (e.g. cz-shortcut-listen); accept the DOM as-is for this element. */}
      <body suppressHydrationWarning>
        {children}
        <CookieNotice />
      </body>
    </html>
  );
}
