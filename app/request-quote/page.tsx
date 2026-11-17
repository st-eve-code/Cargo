import type { Metadata } from "next";
import { site } from "@/lib/site";
import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import ContactForm from "@/components/ContactForm";
import ContactInfo from "@/components/ContactInfo";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: `Request a Quote — ${site.name}`,
  description: "Tell us what you need to ship, where it goes and when. We send a clear quote within one business day.",
};

export default function RequestQuotePage() {
  return (
    <div className="page">
      <div className="frame">
        <SiteNav />
        <main>
          <section className="ab ab-intro">
            <div className="ab-top">
              <h1>Request a Quote</h1>
              <p>Tell us what you are shipping, where it goes and when. We will send you a clear quote within one business day.</p>
            </div>
          </section>

          <section className="ab cn-main" id="quote">
            <div className="cn-photo">
              <Image src="/images/contact-courier.webp" alt="Courier with a parcel and clipboard" width={735} height={982} sizes="(max-width:900px) 70vw, 460px" priority />
            </div>
            <div className="cn-formwrap">
              <h2>Get your quote</h2>
              <p>Include the departure and destination cities, the weight and the number of packages. Anything else you know helps us price it accurately.</p>
              <ContactForm kind="quote" />
            </div>
          </section>

          <ContactInfo />
        </main>
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
}
