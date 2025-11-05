import React from "react";
import FeaturedArticles from "~/sections/CareerGuide/Feature/FeaturedArticles";
import NewArticles from "~/sections/CareerGuide/New/NewArticles";
import SubBanner from "~/sections/CareerGuide/SubBanner";

/* ---------- Page ---------- */
export default function CareerGuide() {
  // demo data – thay bằng API của bạn
  const listItems = [
    {
      id: "a1",
      category: "TIN TỨC",
      title: "Vieclam24h cho ra mắt: Tóm lược Thị trường Lao động Việt Nam đầu năm 2025",
      thumb: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=640&auto=format&fit=crop",
      author: "Minh Anh",
      time: "2 giờ trước",
      href: "#",
    },
    {
      id: "a2",
      category: "KỸ NĂNG",
      title: "Tính năng Fast update: Giải pháp cập nhật trạng thái ứng tuyển nhanh chóng",
      thumb: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=640&auto=format&fit=crop",
      author: "Thu Hà",
      time: "5 giờ trước",
      href: "#",
    },
    {
      id: "a3",
      category: "PHỎNG VẤN",
      title: "Gen Z nhảy việc: Xu hướng mới và những lý do thúc đẩy thế hệ mới tìm kiếm cơ hội",
      thumb: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=640&auto=format&fit=crop",
      author: "Đức Minh",
      time: "1 ngày trước",
      href: "#",
    },
    {
      id: "a4",
      category: "CV & HỒ SƠ",
      title: "Bạn muốn tìm việc nhanh hơn, dễ dàng hơn? Bí quyết tối ưu CV hiệu quả",
      thumb: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=640&auto=format&fit=crop",
      author: "Lan Anh",
      time: "2 ngày trước",
      href: "#",
    },
    {
      id: "a5",
      category: "NGHỀ NGHIỆP",
      title: "Top 10 ngành nghề hot nhất năm 2025: Cơ hội và thách thức",
      thumb: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=640&auto=format&fit=crop",
      author: "Quang Huy",
      time: "3 ngày trước",
      href: "#",
    },
    {
      id: "a6",
      category: "LƯƠNG THƯỞNG",
      title: "Mức lương trung bình các ngành năm 2025: Báo cáo chi tiết",
      thumb: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=640&auto=format&fit=crop",
      author: "Mai Phương",
      time: "4 ngày trước",
      href: "#",
    },
  ];

  const featured = {
    title: "Vieclam24h cho ra mắt: Báo cáo Thị trường Lao động Q2.2025",
    excerpt: "Bức tranh toàn diện về tâm lý, hành vi và kỳ vọng của người lao động sau làn sóng cắt giảm. Báo cáo phân tích thách thức tuyển dụng từ phía doanh nghiệp và đưa ra các góc nhìn thực tiễn.",
    image: "https://vieclam24h.vn/_next/image?url=https%3A%2F%2Fwp-cms-media.s3.ap-east-1.amazonaws.com%2FLayoff_Report_Vieclam24h_30_07_1ecb67ca7b.png&w=3840&q=75",
    meta: "5 tháng 11, 2025 · 12 phút đọc",
    href: "#",
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SubBanner />
      <FeaturedArticles featured={featured} items={listItems} />
      <NewArticles items={listItems} />
    </main>
  );
}
