import CardSection from "../components/Cards/CardSection";
import SectionTitle from "../components/SectionTitle";

export default function NewJobsSection() {
    return (
        <>
            <SectionTitle text1="Features" text2="Features Overview" text3="A visual collection of our most recent works - each piece crafted with intention, emotion and style." />

            <div className="flex flex-wrap items-center justify-center gap-10 mt-16">
                <CardSection />
                <CardSection />
                <CardSection />
                <CardSection />
            </div>
        </>
    );
}