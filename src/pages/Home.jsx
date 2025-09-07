import BottomBanner from "../sections/BottomBanner";
import { FaqSection } from "../sections/FaqSection";
import FeaturesSection from "../sections/FeaturesSection";
import HeroSection from "../sections/HeroSection";
import PopularJobsSection from "../sections/PopularJobsSection";
import PersonalJobsSection from "../sections/PersonalJobsSection";
import Pricing from "../sections/Pricing";
import TestimonialsSection from "../sections/TestimonialsSection";
import TrustedCompanies from "../sections/TrustedCompanies";

export default function Home() {
    return (
        <>
            <HeroSection />
            <TrustedCompanies />
            <PersonalJobsSection />
            <PopularJobsSection />
            <FeaturesSection />
            <TestimonialsSection />
            <Pricing />
            <FaqSection />
            <BottomBanner />
        </>
    );
}