import { ChevronRightIcon, SparklesIcon } from "lucide-react";
import mainBanner from "../assets/images/main-banner.png";
import dotBanner from "../assets/images/hero-section-dot-image.png";

export default function HeroSection() {
  return (
    <div
      className="mt-[-100px] flex flex-col items-center justify-center text-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${dotBanner})` }}
    >
      <a
        href="#"
        className="flex items-center gap-2 rounded-full p-1 pr-3 mt-44 text-indigo-600 bg-indigo-50 mb-2"
      >
        <span className="bg-indigo-600 text-white text-xs px-3.5 py-1 rounded-full">
          LIVE
        </span>
        <p className="flex items-center gap-1">
          <span>3,000+ việc làm tuần này </span>
          <ChevronRightIcon size={16} />
        </p>
      </a>
      <h1 className="text-[40px]/12 md:text-[45px]/16 font-semibold max-w-3xl">
        <span className="bg-gradient-to-r from-[#583DF2] to-[#F3359D] bg-clip-text text-transparent">
          CareerGraph{" "}<br />
        Kết nối nhanh chóng
        </span>
      </h1>
      <p className="text-base text-slate-600 max-w-lg mt-5">
        Kết nối ứng viên và nhà tuyển dụng tại một nơi — từ đăng tin đến đề
        nghị, đơn giản và liền mạch.
      </p>
      <div className="flex items-center gap-4 mt-6">
        <button className="bg-indigo-600 hover:bg-indigo-700 transition px-8 py-3 rounded-md text-white">
          <span>Tìm việc làm</span>
        </button>
        <button className="flex items-center justify-center gap-2 border border-indigo-400 px-5 py-3 rounded-md text-indigo-600">
          <SparklesIcon size={16} />
          <span>Tính năng AI</span>
        </button>
      </div>
      <img
        className="w-5/6 max-w-lg mt-5 mb-3 drop-shadow-2xl drop-shadow-blue-500/15 mx-auto"
        src={mainBanner}
        alt="Hình ảnh thẻ Hero Section"
        width={1500}
        height={500}
        fetchPriority="high"
      />
    </div>
  );
}
