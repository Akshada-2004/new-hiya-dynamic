import HeroSection from "@/app/components/homePage/HeroSection";

import ServiceFinder from "@/app/components/homePage/ServiceFinder";
import DigitalSolutionsSection from "@/app/components/homePage/DigitalSolutionsSection";
import StatsStrip from "@/app/components/homePage/StatsStrip";
import TestimonialSlider from "@/app/components/homePage/TestimonialSlider";



export default function Home() {
  return (
    <>
      <section id="hero">
        <HeroSection />
      </section>
      <section id="service-finder">
        <ServiceFinder />
      </section>
      <section id="digital-solutions">
        <DigitalSolutionsSection />
      </section>
      <section id="stats-strip">
        <StatsStrip />
      </section>
      <section id="testimonials">
        <TestimonialSlider />
      </section>

    </>
  );
}
