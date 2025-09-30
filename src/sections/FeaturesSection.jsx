import SectionTitle from "../components/Sections/SectionTitle";

export default function FeaturesSection() {
  return (
    <>
      <SectionTitle
        text1="Tính năng"
        text2="Tổng quan tính năng"
        text3="Bộ sưu tập trực quan về những công việc gần đây nhất của chúng tôi - mỗi tác phẩm được tạo ra với ý định, cảm xúc và phong cách."
      />

      <div className="flex flex-wrap items-center justify-center gap-10 mt-16">
        <div className="max-w-80 hover:-translate-y-0.5 transition duration-300">
          <img
            className="rounded-xl"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-1.png"
            alt="Hình ảnh thẻ"
            height={400}
            width={400}
          />
          <h3 className="text-base font-semibold text-slate-700 mt-4">
            Phân tích phản hồi
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Nhận thông tin chi tiết tức thì về tài chính của bạn với bảng điều khiển trực tiếp.
          </p>
        </div>
        <div className="max-w-80 hover:-translate-y-0.5 transition duration-300">
          <img
            className="rounded-xl"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-2.png"
            alt="Hình ảnh thẻ"
            height={400}
            width={400}
          />
          <h3 className="text-base font-semibold text-slate-700 mt-4">
            Quản lý người dùng
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Quản lý người dùng hiệu quả với các công cụ quản trị hiện đại.
          </p>
        </div>
        <div className="max-w-80 hover:-translate-y-0.5 transition duration-300">
          <img
            className="rounded-xl"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-3.png"
            alt="Hình ảnh thẻ"
            height={400}
            width={400}
          />
          <h3 className="text-base font-semibold text-slate-700 mt-4">
            Hóa đơn tốt hơn
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Tạo và quản lý hóa đơn chuyên nghiệp với các mẫu tùy chỉnh.
          </p>
        </div>
      </div>
    </>
  );
}
