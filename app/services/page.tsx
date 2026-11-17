import type { Metadata } from "next";
import { site } from "@/lib/site";
import SiteNav from "@/components/SiteNav";
import ServicesHero from "@/components/ServicesHero";
import ServicesIntro from "@/components/ServicesIntro";
import ServicesHelp from "@/components/ServicesHelp";
import SupportServices from "@/components/SupportServices";
import ProcessSteps from "@/components/ProcessSteps";
import ServicesTestimonial from "@/components/ServicesTestimonial";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: `Services — ${site.name}`,
  description: "Air, ocean and road freight, warehousing, packaging and express delivery, tracked from pickup to delivery.",
};

export default function ServicesPage() {
  return (
    <div className="page">
      <div className="frame">
        <SiteNav />
        <ServicesHero />
        <main>
          <ServicesIntro />
          <ServicesHelp />
          <SupportServices />
          <ProcessSteps />
          <ServicesTestimonial />
        </main>
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
}
