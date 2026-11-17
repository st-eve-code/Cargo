import SiteNav from "@/components/SiteNav";
import Hero from "@/components/Hero";
import Modes from "@/components/Modes";
import PartnerLogos from "@/components/PartnerLogos";
import AboutShowcase from "@/components/AboutShowcase";
import Story from "@/components/Story";
import WhyChoose from "@/components/WhyChoose";
import Impact from "@/components/Impact";
import TrustedPartners from "@/components/TrustedPartners";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <div className="page">
      <div className="frame">
        <SiteNav />
        <Hero />
        <Modes />
        <PartnerLogos />
        <AboutShowcase />
        <Story />
        <WhyChoose />
        <Impact />
        <TrustedPartners />
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
}
