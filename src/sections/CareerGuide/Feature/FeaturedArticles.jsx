import Container from "../../../components/Container";
import FeaturedCard from "./FeatureCard";
import FeaturedArticleItem from "./FeaturedArticleItem";

export default function FeaturedArticles({ featured, items = [] }) {
  return (
    <section className="py-10">
      <Container>
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Bài viết nổi bật
        </h2>

        <div className="grid gap-6 md:grid-cols-12">
          {/* Left list */}
          <aside className="md:col-span-5">
            <ul className="space-y-3">
              {items.map((it) => (
                <FeaturedArticleItem key={it.id} item={it} />
              ))}
            </ul>
          </aside>

          <div className="md:col-span-7">
            <FeaturedCard item={featured} />
          </div>
        </div>
      </Container>
    </section>
  );
};