import { ArrowLeft, Clock, Calendar, Share2, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CVBuilderPromo from "~/sections/CareerGuide/Detail/CVBuilderPromo";
import PersonalQuizPromo from "~/sections/CareerGuide/Detail/PersonalQuizPromo";
import RelatedJobs from "~/sections/CareerGuide/Detail/RelatedJobs";

export default function CareerGuideDetail() {
  const navigate = useNavigate();

  // TODO: Fetch article data from API based on slug
  
  const article = {
    id: "1",
    title: "Vieclam24h cho ra mắt: Báo cáo Thị trường Lao động Q2.2025",
    category: "TIN TỨC",
    excerpt: "Bức tranh toàn diện về tâm lý, hành vi và kỳ vọng của người lao động sau làn sóng cắt giảm nhân sự. Khảo sát từ hơn 5,000 ứng viên và 500+ doanh nghiệp trên toàn quốc.",
    content: `
      <div class="lead-paragraph">
        <p class="text-xl font-medium text-slate-700 leading-relaxed mb-8">Thị trường lao động Việt Nam trong quý 2 năm 2025 đã có những biến động đáng chú ý. Sau làn sóng cắt giảm nhân sự vào đầu năm, nhiều doanh nghiệp đã bắt đầu điều chỉnh chiến lược tuyển dụng và chuyển đổi mô hình hoạt động.</p>
      </div>

      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-10 border border-blue-100">
        <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span class="text-2xl"></span> Các chỉ số chính Q2/2025
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-xl p-4 shadow-sm">
            <div class="text-3xl font-bold text-indigo-600">+23%</div>
            <div class="text-sm text-slate-600 mt-1">Nhu cầu tuyển dụng</div>
          </div>
          <div class="bg-white rounded-xl p-4 shadow-sm">
            <div class="text-3xl font-bold text-emerald-600">67%</div>
            <div class="text-sm text-slate-600 mt-1">Remote/Hybrid</div>
          </div>
          <div class="bg-white rounded-xl p-4 shadow-sm">
            <div class="text-3xl font-bold text-purple-600">5.2M</div>
            <div class="text-sm text-slate-600 mt-1">Người tìm việc</div>
          </div>
          <div class="bg-white rounded-xl p-4 shadow-sm">
            <div class="text-3xl font-bold text-orange-600">₫18M</div>
            <div class="text-sm text-slate-600 mt-1">Lương TB (Junior)</div>
          </div>
        </div>
      </div>
      
      <h2>🎯 1. Tổng quan thị trường lao động</h2>
      <p>Theo số liệu từ các nền tảng tuyển dụng hàng đầu, <strong>nhu cầu tuyển dụng đã tăng 23%</strong> so với quý 1. Các ngành công nghệ thông tin, thương mại điện tử và logistics dẫn đầu về số lượng vị trí tuyển dụng.</p>
      
      <p>Đặc biệt, các vị trí liên quan đến <strong>AI, Machine Learning và Data Analytics</strong> tăng trưởng mạnh nhất với 156% so với cùng kỳ năm trước. Xu hướng chuyển đổi số đang thúc đẩy nhu cầu tuyển dụng nhân sự công nghệ.</p>

      <div class="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg my-8">
        <p class="text-amber-900 font-medium mb-2">💡 <strong>Insight:</strong></p>
        <p class="text-amber-800">Các công ty startup công nghệ đang tuyển dụng mạnh mẽ với mức lương cạnh tranh hơn 30-40% so với doanh nghiệp truyền thống trong cùng vị trí.</p>
      </div>
      
      <h2>📈 2. Xu hướng tuyển dụng nổi bật</h2>
      
      <h3>2.1. Mô hình làm việc linh hoạt</h3>
      <p>Sau đại dịch, <strong>67% công ty</strong> tiếp tục duy trì mô hình Remote hoặc Hybrid. Đây không còn là "benefit đặc biệt" mà trở thành tiêu chuẩn mới của thị trường.</p>
      <ul>
        <li><strong>Full Remote:</strong> 28% công ty cho phép làm việc hoàn toàn từ xa</li>
        <li><strong>Hybrid (3+2):</strong> 39% công ty áp dụng 3 ngày văn phòng, 2 ngày WFH</li>
        <li><strong>Flexible Hours:</strong> 72% công ty cho phép linh hoạt giờ làm việc</li>
      </ul>

      <h3>2.2. Đầu tư vào Upskilling & Reskilling</h3>
      <p>Doanh nghiệp đang tăng cường đầu tư đào tạo nội bộ:</p>
      <ul>
        <li>40% ngân sách L&D dành cho kỹ năng AI và Data Analytics</li>
        <li>Chương trình mentoring nội bộ tăng 85%</li>
        <li>Partnership với các nền tảng học online (Coursera, Udemy Business)</li>
      </ul>

      <h3>2.3. Gen Z thống lĩnh thị trường</h3>
      <p>Gen Z (sinh 1997-2012) hiện chiếm <strong>35% lực lượng lao động</strong> và đang định hình lại môi trường làm việc:</p>
      <ul>
        <li>Ưu tiên <strong>work-life balance</strong> hơn mức lương cao</li>
        <li>Chú trọng văn hóa công ty, diversity & inclusion</li>
        <li>Thích thử nghiệm nhiều vai trò (job hopping mỗi 18-24 tháng)</li>
        <li>Sử dụng TikTok và Instagram nhiều hơn LinkedIn để tìm việc</li>
      </ul>
      
      <h2>⚠️ 3. Thách thức của người tìm việc</h2>
      <p>Mặc dù thị trường đang phục hồi, ứng viên vẫn gặp nhiều khó khăn:</p>
      
      <div class="grid md:grid-cols-2 gap-6 my-8">
        <div class="bg-white border border-slate-200 rounded-xl p-6">
          <h4 class="font-bold text-slate-900 mb-3">🎓 Yêu cầu kinh nghiệm cao</h4>
          <p class="text-slate-700 text-sm">Vị trí Junior đòi hỏi 1-2 năm kinh nghiệm. Mid-level cần 3-5 năm. Senior 7+ năm với portfolio ấn tượng.</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-6">
          <h4 class="font-bold text-slate-900 mb-3">🔥 Cạnh tranh gay gắt</h4>
          <p class="text-slate-700 text-sm">Một vị trí AI Engineer nhận trung bình 230 CV. Product Manager hot nhất với 350+ ứng viên/vị trí.</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-6">
          <h4 class="font-bold text-slate-900 mb-3">📚 Khoảng cách kỹ năng</h4>
          <p class="text-slate-700 text-sm">63% HR phản ánh ứng viên thiếu kỹ năng thực tế. Đào tạo chậm hơn nhu cầu thị trường 18-24 tháng.</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-6">
          <h4 class="font-bold text-slate-900 mb-3">💰 Kỳ vọng lương cao</h4>
          <p class="text-slate-700 text-sm">42% ứng viên có kỳ vọng lương cao hơn 30% so với mức thị trường cho vị trí tương ứng.</p>
        </div>
      </div>
      
      <h2>💼 4. Top 10 ngành tuyển dụng nhiều nhất</h2>
      <ol>
        <li><strong>Công nghệ thông tin</strong> - 28% tổng số vị trí (đặc biệt AI/ML, Blockchain)</li>
        <li><strong>Thương mại điện tử</strong> - 15% (vận hành, marketing, customer service)</li>
        <li><strong>Logistics & Vận chuyển</strong> - 12% (driver, quản lý kho, điều phối)</li>
        <li><strong>Tài chính - Ngân hàng</strong> - 9% (fintech, risk management, compliance)</li>
        <li><strong>Y tế - Dược phẩm</strong> - 8% (điều dưỡng, dược sĩ, kỹ thuật viên)</li>
        <li><strong>Giáo dục - Đào tạo</strong> - 7% (giảng viên online, content creator)</li>
        <li><strong>Sản xuất - Chế biến</strong> - 6% (kỹ sư, QC, vận hành máy)</li>
        <li><strong>Bất động sản</strong> - 5% (sales, marketing, quản lý dự án)</li>
        <li><strong>Du lịch - Khách sạn</strong> - 4% (phục hồi sau COVID)</li>
        <li><strong>Marketing - Truyền thông</strong> - 4% (digital marketing, KOL, content)</li>
      </ol>

      <h2>✅ 5. Lời khuyên cho người tìm việc</h2>
      <p>Để tăng cơ hội tìm được việc làm phú hợp trong bối cảnh hiện tại, bạn cần:</p>
      
      <div class="space-y-6 my-8">
        <div class="flex gap-4">
          <div class="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">1</div>
          <div>
            <h4 class="font-bold text-slate-900 mb-2">Phát triển kỹ năng đúng hướng</h4>
            <p class="text-slate-700">Tập trung vào <strong>T-shaped skills</strong>: chuyên sâu 1 kỹ năng core + rộng ở nhiều kỹ năng liên quan. Ưu tiên AI, Data, Cloud Computing, Digital Marketing.</p>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">2</div>
          <div>
            <h4 class="font-bold text-slate-900 mb-2">Xây dựng Personal Brand</h4>
            <p class="text-slate-700">Tối ưu LinkedIn profile, viết blog chuyên môn, tham gia cộng đồng nghề nghiệp. 78% recruiter tìm ứng viên passive qua mạng xã hội.</p>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">3</div>
          <div>
            <h4 class="font-bold text-slate-900 mb-2">Networking thông minh</h4>
            <p class="text-slate-700">Tham gia sự kiện ngành, webinar, workshop. Kết nối với alumni, cựu đồng nghiệp. 65% việc làm được tìm thấy qua referral.</p>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">4</div>
          <div>
            <h4 class="font-bold text-slate-900 mb-2">CV & Portfolio chuyên nghiệp</h4>
            <p class="text-slate-700">Sử dụng template ATS-friendly, highlight số liệu cụ thể (tăng revenue 23%, giảm cost 15%). Portfolio online cho vị trí creative/tech.</p>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="flex-shrink-0 w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold">5</div>
          <div>
            <h4 class="font-bold text-slate-900 mb-2">Chuẩn bị phỏng vấn kỹ lưỡng</h4>
            <p class="text-slate-700">Research công ty, chuẩn bị câu trả lời STAR, luyện tập mock interview. Prepare câu hỏi thông minh để hỏi interviewer.</p>
          </div>
        </div>
      </div>
      
      <h2>🔮 6. Dự báo cho các quý tiếp theo</h2>
      <p>Dựa trên phân tích dữ liệu và xu hướng hiện tại, chúng tôi dự đoán:</p>
      
      <div class="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-8 my-8 border border-purple-100">
        <h3 class="font-bold text-xl text-slate-900 mb-4">📅 Q3/2025 (Tháng 7-9)</h3>
        <ul class="space-y-2 text-slate-700">
          <li>✓ Nhu cầu tuyển dụng tăng thêm 15-18%</li>
          <li>✓ Mức lương junior tăng trung bình 8-12%</li>
          <li>✓ Remote jobs chiếm 35% tổng số vị trí</li>
        </ul>
      </div>

      <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 my-8 border border-blue-100">
        <h3 class="font-bold text-xl text-slate-900 mb-4">📅 Q4/2025 (Tháng 10-12)</h3>
        <ul class="space-y-2 text-slate-700">
          <li>✓ Peak tuyển dụng cho kế hoạch năm 2026</li>
          <li>✓ Bonus và incentive hấp dẫn để giữ chân nhân tài</li>
          <li>✓ Khuynh hướng tuyển dụng theo dự án/freelance tăng 40%</li>
        </ul>
      </div>

      <p class="text-lg font-medium text-slate-800 mt-8">Thị trường lao động 2025 đầy cơ hội nhưng cũng đầy thách thức. Người tìm việc cần chủ động nâng cao năng lực, xây dựng thương hiệu cá nhân và nắm bắt xu hướng để có được công việc mơ ước! 🚀</p>
    `,
    image: "https://vieclam24h.vn/_next/image?url=https%3A%2F%2Fwp-cms-media.s3.ap-east-1.amazonaws.com%2FLayoff_Report_Vieclam24h_30_07_1ecb67ca7b.png&w=3840&q=75",
    author: "Nguyễn Minh Anh",
    authorTitle: "Senior Market Analyst",
    publishedAt: "5 tháng 11, 2025",
    readTime: "12 phút đọc",
    views: "15,234",
    tags: ["Thị trường lao động", "Báo cáo", "Xu hướng tuyển dụng", "Gen Z", "Remote Work", "AI & Tech"],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/handbook")}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Quay lại Cẩm nang nghề nghiệp</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Article Content - BÊN PHẢI (9 columns) */}
          <article className="lg:col-span-9 order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Featured Image */}
              <div className="overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-[420px] object-cover"
                />
              </div>

              <div className="p-8 lg:p-12">
                {/* Article Header */}
                <div className="mb-8">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
                      {article.category}
                    </span>
                    <span className="text-sm text-slate-500">{article.views} lượt xem</span>
                  </div>

                  <h1 className="mb-4 text-3xl font-bold leading-tight text-slate-900 lg:text-4xl">
                    {article.title}
                  </h1>

                  <p className="mb-6 text-lg leading-relaxed text-slate-600">
                    {article.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 border-y border-slate-200 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
                        {article.author.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{article.author}</div>
                        <div className="text-xs text-slate-500">{article.authorTitle}</div>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-slate-200"></div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar size={16} />
                      <span>{article.publishedAt}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock size={16} />
                      <span>{article.readTime}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <button className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                        <Share2 size={18} className="inline mr-1" />
                        Chia sẻ
                      </button>
                      <button className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                        <Bookmark size={18} className="inline mr-1" />
                        Lưu
                      </button>
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div
                  className="prose prose-lg prose-slate max-w-none
                    prose-headings:font-bold prose-headings:text-slate-900
                    prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-2xl prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-3
                    prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-xl
                    prose-h4:mt-4 prose-h4:mb-2 prose-h4:text-lg
                    prose-p:leading-relaxed prose-p:text-slate-700 prose-p:my-4
                    prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                    prose-strong:font-semibold prose-strong:text-slate-900
                    prose-ul:my-4 prose-li:my-1.5 prose-li:text-slate-700
                    prose-ol:my-4 prose-ol:list-decimal
                    prose-img:rounded-xl prose-img:shadow-md"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Tags */}
                <div className="mt-10 border-t border-slate-200 pt-8">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
                    Chủ đề liên quan
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Share CTA */}
                <div className="mt-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-center text-white">
                  <h3 className="mb-3 text-2xl font-bold">
                    Bài viết hữu ích? Chia sẻ ngay! 🚀
                  </h3>
                  <p className="mb-6 text-indigo-100">
                    Giúp bạn bè cập nhật xu hướng thị trường lao động mới nhất
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button className="rounded-lg bg-white px-6 py-3 font-semibold text-slate-700 shadow-md">
                      📘 Facebook
                    </button>
                    <button className="rounded-lg bg-white px-6 py-3 font-semibold text-slate-700 shadow-md">
                      💼 LinkedIn
                    </button>
                    <button className="rounded-lg bg-white px-6 py-3 font-semibold text-slate-700 shadow-md">
                      🐦 Twitter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar - BÊN TRÁI (3 columns) */}
          <aside className="lg:col-span-3 order-1 lg:order-2">
            <div className="sticky top-24 space-y-6">
              <CVBuilderPromo />
              <PersonalQuizPromo />
              <RelatedJobs />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
