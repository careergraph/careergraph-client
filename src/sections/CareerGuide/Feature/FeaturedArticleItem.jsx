import { useNavigate } from "react-router-dom";

function FeaturedArticleItem({item}) {
    const navigate = useNavigate();
    
    const handleClick = () => {
      // Generate slug from title or use item.slug if available
      const slug = item.slug || item.id || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      navigate(`/handbook/${slug}`);
    };
    
    return ( 
        <li 
          className="flex cursor-pointer gap-3 rounded-xl p-2 bg-white border border-slate-200"
          onClick={handleClick}
        >
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
            <div
              className="mt-1 block text-base font-medium text-slate-900"
              title={item.title}
            >
              <span className="line-clamp-2">{item.title}</span>
            </div>
          </div>
        </li>
     );
}

export default FeaturedArticleItem;