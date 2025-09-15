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
    "Part-time",
    "Internship",
    "Hybrid",
    "Remote",
    "On-site",
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
    <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left font-semibold text-slate-900 dark:text-white mb-3"
      >
        <span>{title}</span>
        {expandedSections[sectionKey] ? (
          <ChevronUp size={16} className="text-slate-500" />
        ) : (
          <ChevronDown size={16} className="text-slate-500" />
        )}
      </button>
      {expandedSections[sectionKey] && children}
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
                top-0 left-0 h-full w-75 max-w-[90vw]
                bg-white shadow-xl lg:shadow-sm
                lg:rounded-xl lg:border lg:border-slate-200
                transform transition-transform duration-300 ease-in-out
                ${
                  isOpen
                    ? "translate-x-0"
                    : "-translate-x-full lg:translate-x-0"
                }
            `}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-indigo-600" />
              <h3 className="font-semibold text-lg text-slate-900">Bộ lọc</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearAllFilters}
                className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Xoá tất cả
              </button>
              <button
                onClick={onClose}
                className="lg:hidden p-1 hover:bg-slate-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Search */}
          <FilterSection title="Từ khoá" sectionKey="search">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="VD: Frontend, Sale, Data Analyst..."
                value={filters.search}
                readOnly={false}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </FilterSection>

          {/* Categories */}
          <FilterSection title="Ngành nghề" sectionKey="category">
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={filters.category === category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="mr-3 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">{category}</span>
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-slate-500">-</span>
                <input
                  type="number"
                  placeholder="Tối đa"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(1, e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
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
                <label key={exp} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.rating.includes(exp)}
                    onChange={() => handleRatingChange(exp)}
                    className="mr-3 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">{exp}</span>
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
                  className={`px-3 py-1.5 text-sm rounded-full border transition ${
                    filters.brand.includes(brand)
                      ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
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
