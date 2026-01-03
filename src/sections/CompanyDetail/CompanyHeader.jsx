import { Globe, Users, Calendar, MapPin, Building2 } from "lucide-react";

export default function CompanyHeader({ company }) {
  const {
    name,
    avatar,
    cover,
    website,
    size,
    yearFounded,
    noOfFollowers,
    tagname,
  } = company;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-6">
      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full bg-slate-100 relative">
        {cover ? (
          <img
            src={cover}
            alt={`${name} cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
            <Building2 className="text-white/20 w-24 h-24" />
          </div>
        )}
      </div>

      <div className="px-6 pb-6 relative">
        {/* Avatar & Basic Info */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12 mb-6">
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-white bg-white shadow-md overflow-hidden">
              <img
                src={avatar || "https://placehold.co/128x128?text=Logo"}
                alt={name}
                className="w-full h-full object-contain p-1"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0 pt-2 md:pt-0">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 truncate">
              {name}
            </h1>
            {tagname && (
              <p className="text-slate-500 font-medium">@{tagname}</p>
            )}
          </div>

          <div className="flex gap-3">
             {/* Action buttons can go here (Follow, Visit Website) */}
             {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition"
                >
                  <Globe size={18} />
                  Website
                </a>
             )}
             <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm">
                Theo dõi
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Quy mô</p>
              <p className="font-semibold text-slate-900">{size || "Đang cập nhật"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Người theo dõi</p>
              <p className="font-semibold text-slate-900">{noOfFollowers || 0}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Thành lập</p>
              <p className="font-semibold text-slate-900">{yearFounded || "Đang cập nhật"}</p>
            </div>
          </div>
          
           {/* Placeholder for another stat if needed */}
        </div>
      </div>
    </div>
  );
}
