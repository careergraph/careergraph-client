import { useState, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import { LocationService } from "~/services/locationService";
import { resolveLocationSlug } from "~/utils/provinceLocationMap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function SearchBar({
  keyword: keywordProp = "",
  locationSlug: locationSlugProp = "",
  keywordPlaceholder = "Tìm kiếm việc làm, công ty, từ khoá...",
  onSearch,
}) {
  const [keyword, setKeyword] = useState(keywordProp);
  const [location, setLocation] = useState(locationSlugProp);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setKeyword(keywordProp);
  }, [keywordProp]);

  useEffect(() => {
    setLocation(locationSlugProp);
  }, [locationSlugProp]);

  useEffect(() => {
    const loadProvinces = async () => {
      setLoading(true);
      try {
        const data = await LocationService.fetchProvinces();
        setProvinces(data);
      } catch (error) {
        console.error("Failed to load provinces:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProvinces();
  }, []);

  useEffect(() => {
    if (!provinces.length || !locationSlugProp) {
      return;
    }

    const resolvedSlug = resolveLocationSlug(provinces, locationSlugProp);
    if (resolvedSlug && resolvedSlug !== locationSlugProp) {
      const selectedProvince = provinces.find(
        (province) => province.slug === resolvedSlug
      );

      onSearch?.({
        keyword: keywordProp,
        location: selectedProvince?.shortName || "",
        locationSlug: resolvedSlug,
        provinceCode: selectedProvince?.code || "",
      });
    }
  }, [provinces, locationSlugProp, keywordProp, onSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!onSearch) {
        return;
      }

      const selectedProvince = provinces.find(
        (province) => province.slug === location
      );

      onSearch({
        keyword,
        location: selectedProvince?.shortName || "",
        locationSlug: selectedProvince?.slug || location || "",
        provinceCode: selectedProvince?.code || "",
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, location, onSearch, provinces]);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
      <div className="flex-1 flex items-center bg-white border-2 border-slate-200 h-11 overflow-hidden focus-within:border-indigo-500 focus-within:shadow-md transition-all rounded-lg">
        <div className="pl-3 pr-2">
          <Search className="text-slate-400" size={18} />
        </div>
        <input
          type="text"
          placeholder={keywordPlaceholder}
          className="flex-1 h-full pr-3 outline-none text-slate-900 placeholder-slate-400 text-sm"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="relative w-full sm:w-52">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" size={18} />
        <Select
          value={location || undefined}
          onValueChange={(value) => setLocation(value === "all" ? "" : value)}
          disabled={loading}
        >
          <SelectTrigger className="pl-10 h-11 border-2 border-slate-200 hover:border-indigo-300 focus:border-indigo-500 focus:shadow-md transition-all rounded-lg text-sm">
            <SelectValue placeholder={loading ? "Đang tải..." : "Tất cả địa điểm"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả địa điểm</SelectItem>
            {provinces.map((province) => (
              <SelectItem key={province.code} value={province.slug}>
                {province.shortName || province.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
