import BlogCard from "../../components/Cards/BlogCard";
import SectionTitle from "../../components/Sections/SectionTitle";

export default function BlogListSection() {
  return (
    <>
      <SectionTitle
        text1="Blogs"
        text2="Danh sách bài viết"
        text3="Chúng tôi phân tích CV và thông tin cá nhân của bạn để đề xuất các vị trí việc làm phù hợp với hồ sơ và kinh nghiệm của bạn."
      />

      <div className="flex items-center justify-center gap-8 pt-12">
        <BlogCard />
        <BlogCard />
        <BlogCard />
      </div>
    </>
  );
}
