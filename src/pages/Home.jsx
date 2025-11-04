import HeroSection from "../sections/Home/HeroSection";
import PopularJobsSection from "../sections/Home/PopularJobsSection";
import PersonalJobsSection from "../sections/Home/PersonalJobsSection";
import TestimonialsSection from "../sections/Home/TestimonialsSection";
import TrustedCompanies from "../sections/Home/TrustedCompanies";
import CategorySection from "../sections/Home/CategorySection";

export default function Home() {
    return (
        <>
            <HeroSection />
            <TrustedCompanies />
            <PersonalJobsSection />
            <PopularJobsSection />
            <CategorySection />
            <TestimonialsSection />
        </>
    );
}