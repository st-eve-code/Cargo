import Image from "next/image";
import { site } from "@/lib/site";

export default function ServicesIntro() {
  return (
    <section className="sv-intro">
      <div className="sv-intro-in">
        <div className="sv-intro-photo">
          <Image src="/images/svc-warehouse.jpg" alt="Warehouse with forklifts and stocked racks" fill sizes="(max-width:900px) 100vw, 600px" />
        </div>
        <div>
          <span className="sv-intro-tag">About {site.shortName}</span>
          <h2>Powering the supply chains behind modern business</h2>
          <p>{site.shortName} helps manufacturers, e-commerce brands, and global importers move goods with precision. Our network, modern fleet, and dedicated team deliver the speed and reliability your customers can count on.</p>
        </div>
      </div>
    </section>
  );
}
