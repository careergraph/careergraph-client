// src/components/Cards/CategoryCardSkeleton.jsx
// Component skeleton loading cho CategoryCard

export default function CategoryCardSkeleton() {
  return (
    <div className="w-64 h-40 bg-gray-200 rounded-lg animate-pulse flex flex-col items-center justify-center shadow-md">
      <div className="w-16 h-16 bg-gray-300 rounded-full mb-4" />
      <div className="w-32 h-4 bg-gray-300 rounded mb-2" />
      <div className="w-24 h-3 bg-gray-300 rounded" />
    </div>
  );
}
