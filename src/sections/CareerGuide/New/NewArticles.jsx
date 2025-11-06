
import Container from "~/components/Containers/Container";
import NewArticleItem from "./NewArticleItem";

export default function NewArticles({items = [], src, TOP_LIMIT=6 }) {

    const top = items.slice(0,TOP_LIMIT)
    const rest = items.slice(TOP_LIMIT)

  return (
    <section className="py-2">
      <Container>
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Bài viết mới nhất
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {top &&
            top.map((it) => (
              <NewArticleItem key={it.id} item={it} />
            ))}
        </div>

        {rest.length>0 &&  (
            <>
                <div className="mt-10 relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-50 via-sky-50 to-cyan-50">
                <img src={src? src : "https://vieclam24h.vn/_next/image?url=https%3A%2F%2Fwp-cms-media.s3.ap-east-1.amazonaws.com%2FCAM_NANG_NN_1280x320_3c63494b69.jpg&w=3840&q=75"}/>
                </div>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items &&
                    items.map((it) => (
                    <NewArticleItem key={it.id} item={it} />
                    ))}
                </div>
            </>
        )
            
        
        }

        </Container>
    </section>
  );
};