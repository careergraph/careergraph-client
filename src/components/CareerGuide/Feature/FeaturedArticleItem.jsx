function FeaturedArticleItem({item}) {
    return ( 
        <li className="flex gap-3 rounded-xl p-2 hover:bg-slate-50">
          {item.thumb && (
            <img
              src={item.thumb}
              alt=""
              className="h-16 w-24 flex-none rounded-lg object-cover"
            />
          )}
          <div className="min-w-0">
            <div className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-slate-700"
            >
              {item.category}
            </div>
            <a
              href={item.href || "#"}
              className="mt-1 block text-base font-medium text-slate-900 hover:text-indigo-600"
              title={item.title}
            >
              <span className="line-clamp-2">{item.title}</span>
            </a>
          </div>
        </li>
     );
}

export default FeaturedArticleItem;