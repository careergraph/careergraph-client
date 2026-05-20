import CategoryCard from "../../components/Cards/CategoryCard";
import SectionTitle from "../../components/Sections/SectionTitle";
import { categoryImageByCode, colorMap, jobCategories } from "~/data/jobResource";
import { useJobEnums } from "~/hooks/useJobEnums";

export default function CategorySection() {
  const { jobCategories: dynamicCategories } = useJobEnums();
  const categories =
    dynamicCategories?.length > 0
      ? dynamicCategories.map((category, index) => ({
          id: index + 1,
          val: category.value,
          title: category.label,
          description: "Khám phá cơ hội việc làm phù hợp với kỹ năng của bạn.",
          image: categoryImageByCode[category.value] || categoryImageByCode.ENGINEER,
        }))
      : jobCategories;

  return (
    <>
      <SectionTitle
        text1="Danh mục việc làm"
        text2="Nhiều danh mục việc làm hơn"
        text3="Nhiều danh mục việc làm để ứng viên tìm kiếm theo kỹ năng của mình, giúp ứng viên tối ưu thời gian tìm kiếm công việc phù hợp."
      />
      <div className="flex flex-wrap items-center justify-center gap-10 mt-16">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            title={category.title}
            description={category.description}
            resource={category.image}
            color={colorMap[category.title] || "bg-gray-200/40"}
          />
        ))}
      </div>
    </>
  );
}
