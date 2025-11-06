import Container from "../../components/Containers/Container";
import { BookOpen, TrendingUp, Sparkles } from "lucide-react";

export default function SubBanner() {
  return (
    <div className="bg-white border-b border-slate-200">
      <Container className="py-16">
        <div className="text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg">
              <BookOpen size={32} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
              Cẩm nang nghề nghiệp
            </h1>
          </div>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12">
            Khám phá xu hướng, kiến thức và lời khuyên từ chuyên gia để phát triển sự nghiệp của bạn
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl mb-4">
                <BookOpen size={24} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">500+</div>
              <div className="text-sm font-medium text-slate-600">Bài viết chuyên sâu</div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-xl mb-4">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">50K+</div>
              <div className="text-sm font-medium text-slate-600">Lượt đọc mỗi tháng</div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500 rounded-xl mb-4">
                <Sparkles size={24} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">20+</div>
              <div className="text-sm font-medium text-slate-600">Chủ đề đa dạng</div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
