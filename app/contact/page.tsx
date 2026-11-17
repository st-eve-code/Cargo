import type { Metadata } from "next";
import { site } from "@/lib/site";
import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import ContactForm from "@/components/ContactForm";
import ContactInfo from "@/components/ContactInfo";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: `Contact Us — ${site.name}`,
  description: "Send us a message or call our team. We reply within one business day.",
};

export default function ContactPage() {
  return (
    <div className="page">
      <div className="frame">
        <SiteNav />
        <main>
          {/* same header pattern as the About page */}
          <section className="ab ab-intro">
            <div className="ab-top">
              <h1>Contact Us</h1>
              <p>Have a question or need a quote? Send us a message and our team will get back to you within one business day.</p>
            </div>
          </section>

          <section className="ab cn-main" id="message">
            <div className="cn-photo">
              <Image src="/images/contact-courier.webp" alt="Courier with a parcel and clipboard" width={735} height={982} sizes="(max-width:900px) 70vw, 460px" priority />
            </div>
            <div className="cn-formwrap">
              <h2>Send us a message</h2>
              <p>Tell us what you need to ship, or ask us anything. The more detail you give, the faster we can reply.</p>
              <ContactForm />
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
