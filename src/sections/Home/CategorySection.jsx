import CategoryCard from "../../components/Cards/CategoryCard";
import SectionTitle from "../../components/Sections/SectionTitle";
import { categoriesJob } from "../../data/categoriesJob";

export default function CategorySection() {
  return (
    <>
      <SectionTitle
        text1="Danh mục việc làm"
        text2="Nhiều danh mục việc làm hơn"
        text3="Nhiều danh mục việc làm để ứng viên tìm kiếm theo kỹ năng của mình, giúp ứng viên tối ưu thời gian tìm kiếm công việc phù hợp."
      />

      <div className="flex flex-wrap items-center justify-center gap-10 mt-16">
        {categoriesJob.map((category, index) => (
          <CategoryCard
            key={index}
            title={category.title}
            description={category.description}
            resource={category.resource}
            color={category.color}
          />
        ))}
      </div>
    </>
  );
}
