import Preloader from "@/components/home-new/Preloader";
import AnnouncementBar from "@/components/home-new/AnnouncementBar";
import Hero from "@/components/home-new/Hero";
import Hero2 from "@/components/home-new/Hero2";
import HowItWorks from "@/components/home-new/HowItWorks";
import FeatureHub from "@/components/home-new/FeatureHub";
import FeaturesSticky from "@/components/home-new/FeaturesSticky";
import Pricing from "@/components/home-new/Pricing";
import Stats from "@/components/home-new/Stats";
import UseCases from "@/components/home-new/UseCases";
import FAQSection from "@/components/home-new/FAQ";
import CTASection from "@/components/home-new/CTA";
import HashScroll from "@/components/home-new/HashScroll";
import PageTransition from "@/components/home-new/PageTransition";

export default function Home() {
  return (
    <>
      <Preloader />
      <HashScroll />
      <PageTransition>
        <AnnouncementBar />
        <Hero />
        <Hero2 />
        <HowItWorks />
        <FeatureHub />
        <FeaturesSticky />
        <Pricing />
        <Stats />
        <UseCases />
        <FAQSection />
        <CTASection />
      </PageTransition>
    </>
  );
}
