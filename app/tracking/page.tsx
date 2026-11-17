import type { Metadata } from "next";
import { site } from "@/lib/site";
import SiteNav from "@/components/SiteNav";
import TrackingApp from "@/components/TrackingApp";
import TrackingInfo from "@/components/TrackingInfo";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: `Tracking — ${site.name}`,
  description: "Enter your tracking number to see where your cargo is right now. No account needed.",
};

export default function TrackingPage() {
  return (
    <div className="page">
      <div className="frame">
        <SiteNav />
        <main>
          <section className="ab ab-intro">
            <div className="ab-top">
              <h1>Tracking</h1>
              <p>Enter your tracking number to see where your cargo is right now. No account needed.</p>
            </div>
          </section>
          <TrackingApp />
          <TrackingInfo />
        </main>
        <Footer />
      </div>
    </div>
  );
}
