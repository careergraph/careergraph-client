import { ChevronRightIcon, SparklesIcon } from "lucide-react";
import mainBanner from "../assets/images/main-banner.png";
import dotBanner from "../assets/images/hero-section-dot-image.png";

export default function HeroSection() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${dotBanner})` }}
    >
      <a
        href="#"
        className="flex items-center gap-2 rounded-full p-1 pr-3 mt-44 text-indigo-600 bg-indigo-50"
      >
        <span className="bg-indigo-600 text-white text-xs px-3.5 py-1 rounded-full">
          LIVE
        </span>
        <p className="flex items-center gap-1">
          <span>3,000+ jobs this week </span>
          <ChevronRightIcon size={16} />
        </p>
      </a>
      <h1 className="text-[40px]/12 md:text-[45px]/16 font-semibold max-w-3xl mt-4">
        CareerGraph Connect candidates and employers faster
      </h1>
      <p className="text-base text-slate-600 max-w-lg mt-5">
        Connect candidates and employers in one place — from posting to offer,
        simple and seamless.
      </p>
      <div className="flex items-center gap-4 mt-6">
        <button className="bg-indigo-600 hover:bg-indigo-700 transition px-8 py-3 rounded-md text-white">
          <span>Find Jobs</span>
        </button>
        <button className="flex items-center justify-center gap-2 border border-indigo-400 px-5 py-3 rounded-md text-indigo-600">
          <SparklesIcon size={16} />
          <span>AI Features</span>
        </button>
      </div>
      <img
        className="w-5/6 max-w-lg mt-5 mb-3 drop-shadow-2xl drop-shadow-blue-500/15 mx-auto"
        src={mainBanner}
        alt="Hero Section Card Image"
        width={1500}
        height={500}
        fetchPriority="high"
      />
    </div>
  );
}
