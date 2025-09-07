import BottomBanner from "../sections/BottomBanner";
import { FaqSection } from "../sections/FaqSection";
import FeaturesSection from "../sections/FeaturesSection";
import HeroSection from "../sections/HeroSection";
import NewJobsSection from "../sections/NewJobsSection";
import Pricing from "../sections/Pricing";
import Testimonials from "../sections/Testimonials";
import TrustedCompanies from "../sections/TrustedCompanies";

export default function Home() {
    return (
        <>
            <HeroSection />
            <TrustedCompanies />
            <NewJobsSection />
            <FeaturesSection />
            <Testimonials />
            <Pricing />
            <FaqSection />
            <BottomBanner />
        </>
    );
}