import NewsLetterSection from "../sections/BottomBanner";
import FaqSection from "../sections/FaqSection";
import FeaturesSection from "../sections/FeaturesSection";
import SectionPricing from "../components/Sections/SectionPricing";
import BlogListSection from "../sections/BlogListSection";

export default function About() {
  return (
    <>
      <FeaturesSection />
      <BlogListSection />
      <SectionPricing />
      <FaqSection />
      <NewsLetterSection />
    </>
  );
}
