function NewArticleItem({ item }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition">
      {/* Ảnh */}
      <img
        className="w-full h-48 object-cover"
        src={
          item.thumb ||
          "https://images.unsplash.com/photo-1560264418-c4445382edbc?q=80&w=400"
        }
        alt={item.title}
      />

      {/* Nội dung */}
      <div className="p-4">
        <h3 className="text-gray-900 font-medium text-base line-clamp-2">
          {item.title ||
            "Lòng tự trọng là gì? Bí quyết xây dựng giá trị bản thân và thành công nơi công sở"}
        </h3>
        <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
          <span>
            Bởi{" "}
            <span className="text-blue-600 hover:underline">
              {item.author || "admin"}
            </span>
          </span>
          <span>•</span>
          <span>{item.time || "1 giờ trước"}</span>
        </div>
      </div>
    </div>
  );
}

export default NewArticleItem;
