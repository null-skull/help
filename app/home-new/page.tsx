import type { Metadata } from "next";
import Preloader from "@/components/home-new/Preloader";
import BookDemoModal from "@/components/home-new/BookDemoModal";
import Nav from "@/components/home-new/Nav";
import AnnouncementBar from "@/components/home-new/AnnouncementBar";
import Hero from "@/components/home-new/Hero";
import Hero2 from "@/components/home-new/Hero2"
import HowItWorks from "@/components/home-new/HowItWorks";
import FeatureHub from "@/components/home-new/FeatureHub";
import LogoMarquee from "@/components/home-new/LogoMarquee";
import FeaturesSticky from "@/components/home-new/FeaturesSticky";
import Pricing from "@/components/home-new/Pricing";
import Stats from "@/components/home-new/Stats";
import UseCases from "@/components/home-new/UseCases";
import FAQSection from "@/components/home-new/FAQ";
import CTASection from "@/components/home-new/CTA";
import Footer from "@/components/home-new/Footer";

export const metadata: Metadata = {
  title: "Helpperr — Professional Documentation, Built in Minutes",
  description:
    "Record any workflow with our Chrome extension. Helpperr's AI instantly transforms it into polished, searchable, reusable documentation - no writing required.",
};

export default function HomeNew() {
  return (
    <div className="home-new min-h-screen bg-page font-display text-fg">
      <Preloader />
      <Nav />
      <AnnouncementBar />
      <Hero />
      <Hero2/>
      <HowItWorks />
      <FeatureHub />
      {/* <LogoMarquee /> */}
      <FeaturesSticky />
      <Pricing />
      <Stats />
      <UseCases />
      <FAQSection />
      <CTASection />
      <Footer />
      <BookDemoModal />
    </div>
  );
}
