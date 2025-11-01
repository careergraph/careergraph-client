import React from "react";
import FeaturedArticles from "~/sections/CareerGuide/Feature/FeaturedArticles";
import FeaturedKeywords from "~/sections/CareerGuide/Feature/FeaturedKeywords";
// import HeaderNavSub from "~/sections/CareerGuide/HeaderNavSub";
import NewArticles from "~/sections/CareerGuide/New/NewArticles";

import SubBanner from "~/sections/CareerGuide/SubBanner";



/* ---------- Page ---------- */
export default function CareerGuide() {
  // demo data – thay bằng API của bạn
  const listItems = [
    {
      id: "a1",
      category: "LOA TIN TỨC",
      title:
        "Vieclam24h cho ra mắt: Tóm lược Thị trường Lao động Việt Nam đầu năm 2025",
      thumb:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=640&auto=format&fit=crop",
      href: "#",
    },
    {
      id: "a2",
      category: "LOA TIN TỨC",
      title:
        "Tính năng Fast update: Giải pháp cập nhật trạng thái ứng tuyển nhanh chóng",
      thumb:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=640&auto=format&fit=crop",
      href: "#",
    },
    {
      id: "a3",
      category: "BÀN TRÒN CÔNG SỞ",
      title:
        "Gen Z nhảy việc: Xu hướng mới và những lý do thúc đẩy thế hệ mới tìm kiếm cơ hội",
      thumb:
        "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=640&auto=format&fit=crop",
      href: "#",
    },
    {
      id: "a4",
      category: "LOA TIN TỨC",
      title: "Bạn muốn tìm việc nhanh hơn, dễ dàng hơn?",
      thumb:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=640&auto=format&fit=crop",
      href: "#",
    },
    {
      id: "a5",
      category: "LOA TIN TỨC",
      title: "Đang test dữ liệu?",
      thumb:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=640&auto=format&fit=crop",
      href: "#",
    },
  ];

  const featured = {
    title:
      "Vieclam24h cho ra mắt: Báo cáo Thị trường Lao động Q2.2025",
    excerpt:
      "Bức tranh toàn diện về tâm lý, hành vi và kỳ vọng của người lao động sau làn sóng cắt giảm. Báo cáo phân tích thách thức tuyển dụng từ phía doanh nghiệp và đưa ra các góc nhìn thực tiễn.",
    image:
      "https://vieclam24h.vn/_next/image?url=https%3A%2F%2Fwp-cms-media.s3.ap-east-1.amazonaws.com%2FLayoff_Report_Vieclam24h_30_07_1ecb67ca7b.png&w=3840&q=75",
    meta: "Đăng ngày 15/09/2025 · 8 phút đọc",
    href: "#",
  };
  const keywords = [
    { label: "Việc làm Đà Nẵng", href: "/nghe-nghiep/da-nang" },
    { label: "Việc làm Đà Nẵng1", href: "/nghe-nghiep/da-nang" },
    { label: "Việc làm Đà Nẵng2", href: "/nghe-nghiep/da-nang" },
    { label: "Việc làm Đà Nẵng3", href: "/nghe-nghiep/da-nang" },
    { label: "Việc làm Đà Nẵng4", href: "/nghe-nghiep/da-nang" },

  ];
  return (
    <main className="bg-white">
      <SubBanner />
      <FeaturedArticles featured={featured} items={listItems} />
      <NewArticles items={listItems}/>
      <FeaturedKeywords keywords={keywords} />
      
    </main>
  );
}
