import BlogCard from "../../components/Cards/BlogCard";
import SectionTitle from "../../components/Sections/SectionTitle";

export default function BlogListSection() {
  return (
    <>
      <SectionTitle
        text1="Blogs"
        text2="List Of Blog"
        text3="We base on your CV and personal information you have provided to suggest suitable jobs for you to apply for."
      />

      <div className="flex items-center justify-center gap-8 pt-12">
        <BlogCard />
        <BlogCard />
        <BlogCard />
      </div>
    </>
  );
}
