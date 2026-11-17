import type { Metadata } from "next";
import { site } from "@/lib/site";
import SiteNav from "@/components/SiteNav";
import AboutIntro from "@/components/AboutIntro";
import Integrations from "@/components/Integrations";
import AboutStory from "@/components/AboutStory";
import TrustedBand from "@/components/TrustedBand";
import WhoWeAre from "@/components/WhoWeAre";
import SpreadWorld from "@/components/SpreadWorld";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: `About Us — ${site.name}`,
  description: "We simplify global shipping with modern technology, reliable networks, and smart logistics solutions.",
};

export default function AboutPage() {
  return (
    <div className="page">
      <div className="frame">
        <SiteNav />
        <main>
          <AboutIntro />
          <Integrations />
          <AboutStory />
          <TrustedBand />
          <WhoWeAre />
          <SpreadWorld />
        </main>
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
}
