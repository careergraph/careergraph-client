import NewsLetterSection from "../sections/Blog/BottomBanner";
import FaqSection from "../sections/Blog/FaqSection";
import FeaturesSection from "../sections/Blog/FeaturesSection";
import SectionPricing from "../sections/Blog/SectionPricing";
import BlogListSection from "../sections/Blog/BlogListSection";

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
