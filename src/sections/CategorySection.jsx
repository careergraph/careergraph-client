import CategoryCard from "../components/Cards/CategoryCard";
import SectionTitle from "../components/Sections/SectionTitle";
import { categoriesJob } from "../data/categoriesJob";

export default function CategorySection() {
  return (
    <>
      <SectionTitle
        text1="Job Categories"
        text2="More Category For Job"
        text3="Many job categories for candidates to search according to their skills, helping candidates optimize their time searching for suitable jobs."
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
