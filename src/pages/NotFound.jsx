import { Home, ArrowLeft, Search, Mail, FileQuestion } from "lucide-react";
import { Link } from "react-router-dom";
import dotBanner from "../assets/images/hero-section-dot-image.png";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat relative -mt-15"
      style={{ backgroundImage: `url(${dotBanner})` }}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          Oops! Trang không tồn tại
        </h2>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 my-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"></div>
          <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"></div>
        </div>

        {/* Description */}
        <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto mb-8">
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không
          khả dụng.
          <br />
          Hãy thử tìm kiếm hoặc quay về trang chủ.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            to="/home"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 active:scale-95"
          >
            <Home size={20} />
            Về trang chủ
          </Link>

          <Link
            to="/jobs"
            className="flex items-center gap-2 bg-white hover:bg-slate-50 px-6 py-3 text-slate-800 rounded-lg font-medium border-2 border-slate-200 transition-all active:scale-95"
          >
            <Search size={20} />
            Tìm việc làm
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-slate-700 mb-4">
            Các trang phổ biến
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              to="/home"
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-indigo-50 transition group"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition">
                <Home size={20} className="text-indigo-600" />
              </div>
              <span className="text-xs font-medium text-slate-700">
                Trang chủ
              </span>
            </Link>

            <Link
              to="/jobs"
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-indigo-50 transition group"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition">
                <Search size={20} className="text-indigo-600" />
              </div>
              <span className="text-xs font-medium text-slate-700">
                Việc làm
              </span>
            </Link>

            <Link
              to="/build-cv"
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-indigo-50 transition group"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition">
                <ArrowLeft size={20} className="text-indigo-600" />
              </div>
              <span className="text-xs font-medium text-slate-700">Tạo CV</span>
            </Link>

            <Link
              to="/about"
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-indigo-50 transition group"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition">
                <Mail size={20} className="text-indigo-600" />
              </div>
              <span className="text-xs font-medium text-slate-700">
                Liên hệ
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
