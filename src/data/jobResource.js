import engineer from "../assets/images/job-category-1.png";
import business from "../assets/images/job-category-2.png";
import art from "../assets/images/job-category-3.png";
import admin from "../assets/images/job-category-4.png";
import sale from "../assets/images/job-category-5.png";
import education from "../assets/images/job-category-6.png";
import customer from "../assets/images/job-category-7.png";
import manufacture from "../assets/images/job-category-8.png";

const jobResource = [
  engineer,
  business,
  art,
  admin,
  sale,
  education,
  customer,
  manufacture,
];

const colorMap = {
  "Kỹ thuật": "bg-indigo-200/40",
  "Kinh doanh": "bg-pink-200/40",
  "Nghệ thuật & Âm nhạc": "bg-yellow-200/40",
  "Hành chính": "bg-green-200/40",
  "Bán hàng": "bg-purple-200/40",
  "Giáo dục": "bg-blue-200/40",
  "Chăm sóc khách hàng": "bg-orange-200/40",
  "Sản xuất": "bg-teal-200/40",
};

const jobCategories = [
  {
    id: 1,
    val: "ENGINEER",
    title: "Kỹ thuật",
    description:
      "Xây dựng và đổi mới các giải pháp trong các lĩnh vực kỹ thuật khác nhau.",
    image: engineer,
    color: "#4F46E5", // Indigo
  },
  {
    id: 2,
    val: "BUSINESS",
    title: "Kinh doanh",
    description:
      "Lập kế hoạch chiến lược, quản lý nguồn lực và thúc đẩy tăng trưởng tổ chức.",
    image: business,
    color: "#0EA5E9", // Sky Blue
  },
  {
    id: 3,
    val: "ART_MUSIC",
    title: "Nghệ thuật & Âm nhạc",
    description:
      "Thể hiện sự sáng tạo thông qua nghệ thuật thị giác, biểu diễn và âm nhạc.",
    image: art,
    color: "#EC4899", // Pink
  },
  {
    id: 4,
    val: "ADMINISTRATION",
    title: "Hành chính",
    description: "Hỗ trợ hoạt động hàng ngày với tổ chức và phối hợp.",
    image: admin,
    color: "#64748B", // Slate Gray
  },
  {
    id: 5,
    val: "SALES",
    title: "Bán hàng",
    description:
      "Quảng bá sản phẩm, xây dựng mối quan hệ và đạt được doanh thu.",
    image: sale,
    color: "#F59E0B", // Amber
  },
  {
    id: 6,
    val: "EDUCATION",
    title: "Giáo dục",
    description:
      "Hướng dẫn và truyền cảm hứng cho người học ở các độ tuổi khác nhau.",
    image: education,
    color: "#10B981", // Green
  },
  {
    id: 7,
    val: "CUSTOMER_SERVICE",
    title: "Chăm sóc khách hàng",
    description:
      "Hỗ trợ khách hàng, giải quyết vấn đề và đảm bảo sự hài lòng của khách hàng.",
    image: customer,
    color: "#8B5CF6", // Violet
  },
  {
    id: 8,
    val: "MANUFACTURING",
    title: "Sản xuất",
    description:
      "Sản xuất hàng hóa hiệu quả với kiểm soát chất lượng và đổi mới.",
    image: manufacture,
    color: "#EF4444", // Red
  },
];

export { jobResource, colorMap, jobCategories };
