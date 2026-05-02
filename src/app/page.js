import HeroSection from "@/app/components/homePage/HeroSection";

import ServiceFinder from "@/app/components/homePage/ServiceFinder";
import DigitalSolutionsSection from "@/app/components/homePage/DigitalSolutionsSection";
import StatsStrip from "@/app/components/homePage/StatsStrip";
import TestimonialSlider from "@/app/components/homePage/TestimonialSlider";



export default function Home() {
  return (
    <>
      <HeroSection />
      <ServiceFinder />
      <DigitalSolutionsSection />
      <StatsStrip />
      <TestimonialSlider />

    </>
  );
}
