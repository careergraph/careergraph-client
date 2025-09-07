import HeroSection from "../sections/HeroSection";
import PopularJobsSection from "../sections/PopularJobsSection";
import PersonalJobsSection from "../sections/PersonalJobsSection";
import TestimonialsSection from "../sections/TestimonialsSection";
import TrustedCompanies from "../sections/TrustedCompanies";
import CategorySection from "../sections/CategorySection";
import ChatBotButton from "../components/Buttons/ChatBotButton";

export default function Home() {
    return (
        <>
            <HeroSection />
            <TrustedCompanies />
            <PersonalJobsSection />
            <PopularJobsSection />
            <CategorySection />
            <TestimonialsSection />
            <ChatBotButton />
        </>
    );
}