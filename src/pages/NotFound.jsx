import dotBanner from "../assets/images/hero-section-dot-image.png";

export default function NotFound() {
  return (
    <div
      className="flex flex-col mt-44 items-center justify-center text-sm max-md:px-4 bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${dotBanner})` }}
    >
      <h1 className="text-8xl md:text-9xl bg-gradient-to-r from-[#583DF2] to-[#F3359D] font-bold bg-clip-text text-transparent">
        404
      </h1>

      <div className="h-1 w-16 rounded my-5 md:my-7"></div>

      <p className="text-2xl md:text-3xl bg-gradient-to-r from-[#583DF2] to-[#F3359D] font-bold bg-clip-text text-transparent">
        Không tìm thấy trang
      </p>

      <p className="text-sm md:text-base mt-4 text-gray-500 max-w-md text-center">
        Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
      </p>

      <div className="flex items-center gap-4 mt-6">
        <a
          href="/home"
          className="bg-indigo-500 hover:bg-indigo-800 px-7 py-2.5 text-white rounded-md active:scale-95 transition-all"
        >
          Về trang chủ
        </a>

        <a
          href="home"
          className="border border-gray-300 px-7 py-2.5 text-gray-800 rounded-md active:scale-95 transition-all"
        >
          Liên hệ hỗ trợ
        </a>
      </div>
    </div>
  );
}
