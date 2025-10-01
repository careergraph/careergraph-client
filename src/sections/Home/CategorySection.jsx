import { useEffect, useState } from "react";
import CategoryCard from "../../components/Cards/CategoryCard";
import SectionTitle from "../../components/Sections/SectionTitle";
import { getJobCategories } from "~/api/jobsApi";
import CategoryCardSkeleton from "../../components/Cards/CategoryCardSkeleton";
import { jobResource } from "~/data/jobResource";

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // TODO: Lấy token động nếu cần
        const response = await getJobCategories();
        console.log("Categories response:", response.data);
        setCategories(response.data);
      } catch (error) {
        setError("Failed to fetch categories: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <>
        <SectionTitle
          text1="Danh mục việc làm"
          text2="Nhiều danh mục việc làm hơn"
          text3="Nhiều danh mục việc làm để ứng viên tìm kiếm theo kỹ năng của mình, giúp ứng viên tối ưu thời gian tìm kiếm công việc phù hợp."
        />
        <div className="flex flex-wrap items-center justify-center gap-10 mt-16">
          {[...Array(8)].map((_, idx) => (
            <CategoryCardSkeleton key={idx} />
          ))}
        </div>
      </>
    );
  }
  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }
  return (
    <>
      <SectionTitle
        text1="Danh mục việc làm"
        text2="Nhiều danh mục việc làm hơn"
        text3="Nhiều danh mục việc làm để ứng viên tìm kiếm theo kỹ năng của mình, giúp ứng viên tối ưu thời gian tìm kiếm công việc phù hợp."
      />
      <div className="flex flex-wrap items-center justify-center gap-10 mt-16">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            title={category.name}
            description={category.description}
            resource={jobResource[index]}
            color={category.color}
          />
        ))}
      </div>
    </>
  );
}
