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

export { jobResource, colorMap };