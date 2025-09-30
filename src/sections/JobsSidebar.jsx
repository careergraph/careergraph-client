import React, { useState } from "react";
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react";

const JobsSidebar = ({ isOpen, onClose, onFilterChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    category: true,
    price: true,
    rating: true,
    brand: true,
  });

  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    priceRange: [0, 3000],
    rating: [],
    brand: [],
  });

  const categories = [
    "Tất cả",
    "Công nghệ thông tin",
    "Marketing/PR",
    "Kinh doanh/Bán hàng",
    "Chăm sóc khách hàng",
    "Tài chính/Kế toán",
    "Nhân sự/Hành chính",
    "Giáo dục/Đào tạo",
  ];
  const brands = [
    "Full-time",
    "Remote",
    "Part-time",
    "On-site",
    "Internship",
    "Hybrid",
  ];
  const ratings = ["Fresher", "1-3 năm", "3-5 năm", "Trên 5 năm"];

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (index, value) => {
    const newPriceRange = [...filters.priceRange];
    newPriceRange[index] = parseInt(value);
    handleFilterChange("priceRange", newPriceRange);
  };

  const handleRatingChange = (rating) => {
    const newRatings = filters.rating.includes(rating)
      ? filters.rating.filter((r) => r !== rating)
      : [...filters.rating, rating];
    handleFilterChange("rating", newRatings);
  };

  const handleBrandChange = (brand) => {
    const newBrands = filters.brand.includes(brand)
      ? filters.brand.filter((b) => b !== brand)
      : [...filters.brand, brand];
    handleFilterChange("brand", newBrands);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: "",
      category: "All",
      priceRange: [0, 3000],
      rating: [],
      brand: [],
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="bg-slate-50 rounded-xl p-4 mb-5 shadow-sm border border-slate-100">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left font-semibold text-indigo-700 mb-3 transition hover:text-indigo-900"
      >
        <span>{title}</span>
        {expandedSections[sectionKey] ? (
          <ChevronUp size={18} className="text-indigo-400 transition" />
        ) : (
          <ChevronDown size={18} className="text-indigo-400 transition" />
        )}
      </button>
      <div className={`transition-all duration-300 ${expandedSections[sectionKey] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        {children}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative lg:translate-x-0 z-50 lg:z-auto
          top-0 left-0 h-full w-80 max-w-[95vw]
          bg-gradient-to-br from-white via-indigo-50 to-white shadow-2xl lg:shadow-md
          lg:rounded-2xl lg:border lg:border-slate-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-7 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <span className="bg-indigo-100 p-2 rounded-full shadow">
                <Filter size={22} className="text-indigo-600" />
              </span>
              <h3 className="font-bold text-xl text-indigo-700 tracking-tight">Bộ lọc</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearAllFilters}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-1 rounded-lg bg-indigo-50"
              >
                Xoá tất cả
              </button>
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Search */}
          <FilterSection title="Từ khoá" sectionKey="search">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"
              />
              <input
                type="text"
                placeholder="VD: Frontend, Sale, Data Analyst..."
                value={filters.search}
                readOnly={false}
                className="w-full pl-11 pr-4 py-2.5 border border-indigo-100 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
              />
            </div>
          </FilterSection>

          {/* Categories */}
          <FilterSection title="Ngành nghề" sectionKey="category">
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center cursor-pointer px-2 py-1 rounded-lg hover:bg-indigo-50 transition"
                >
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={filters.category === category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="mr-3 text-indigo-600 focus:ring-indigo-500 accent-indigo-500"
                  />
                  <span className={`text-sm ${filters.category === category ? 'text-indigo-700 font-semibold' : 'text-slate-700'}`}>{category}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Mức lương (triệu/tháng)" sectionKey="price">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Tối thiểu"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(0, e.target.value)}
                  className="w-full px-3 py-2 border border-indigo-100 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  placeholder="Tối đa"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(1, e.target.value)}
                  className="w-full px-3 py-2 border border-indigo-100 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                />
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="50"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(1, e.target.value)}
                  className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-indigo-400 mt-1">
                  <span>0</span>
                  <span>{filters.priceRange[1]}+</span>
                </div>
              </div>
            </div>
          </FilterSection>

          {/* Rating */}
          <FilterSection title="Kinh nghiệm" sectionKey="rating">
            <div className="space-y-2">
              {ratings.map((exp) => (
                <label key={exp} className="flex items-center cursor-pointer px-2 py-1 rounded-lg hover:bg-indigo-50 transition">
                  <input
                    type="checkbox"
                    checked={filters.rating.includes(exp)}
                    onChange={() => handleRatingChange(exp)}
                    className="mr-3 text-indigo-600 focus:ring-indigo-500 accent-indigo-500"
                  />
                  <span className={`text-sm ${filters.rating.includes(exp) ? 'text-indigo-700 font-semibold' : 'text-slate-700'}`}>{exp}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Brands */}
          <FilterSection title="Hình thức làm việc" sectionKey="brand">
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => handleBrandChange(brand)}
                  className={`px-4 py-1.5 text-sm rounded-full border font-medium shadow-sm transition flex items-center gap-1
                    ${filters.brand.includes(brand)
                      ? "bg-indigo-100 text-indigo-700 border-indigo-300 scale-105"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-indigo-50"}
                  `}
                >
                  {filters.brand.includes(brand) && <span className="w-2 h-2 bg-indigo-400 rounded-full mr-1"></span>}
                  {brand}
                </button>
              ))}
            </div>
          </FilterSection>
        </div>
      </div>
    </>
  );
};

export default JobsSidebar;
