export default function FeaturedCard ({ item }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-indigo-600 to-indigo-700 text-white">
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="h-52 w-full object-cover opacity-90"
        />
      )}
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <span className="mb-2 inline-block rounded-full  px-2 py-0.5 text-[11px] font-semibold">
          FEATURED
        </span>
        <a href={item.href || "#"} className="focus:outline-none">
          <h3 className="text-2xl font-bold leading-snug group-hover:underline">
            {item.title}
          </h3>
        </a>
        <p className="mt-3 line-clamp-3 text-indigo-100">
          {item.excerpt}
        </p>
        <div className="mt-auto pt-6 text-sm text-indigo-100/80">
          {item.meta}
        </div>
      </div>
    </article>
  );
};