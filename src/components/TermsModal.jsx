import { X } from "lucide-react";
import { useEffect } from "react";

export default function TermsModal({ open, onClose }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-800">Điều khoản dịch vụ</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 text-sm text-slate-600 space-y-4">
          <h3 className="text-base font-semibold text-slate-800">1. Chấp nhận các điều khoản</h3>
          <p>
            Bằng việc truy cập và sử dụng nền tảng Career Graph, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định dưới đây. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
          </p>

          <h3 className="text-base font-semibold text-slate-800">2. Quyền riêng tư và Bảo mật</h3>
          <p>
            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Dữ liệu CV, thông tin ứng tuyển và các hoạt động trên nền tảng sẽ được sử dụng nhằm mục đích kết nối bạn với nhà tuyển dụng và cải thiện trải nghiệm dịch vụ.
          </p>

          <h3 className="text-base font-semibold text-slate-800">3. Trách nhiệm của người dùng</h3>
          <p>
            Bạn chịu trách nhiệm về tính chính xác của các thông tin cung cấp trong hồ sơ và CV của mình. Nghiêm cấm mọi hành vi tạo tài khoản giả mạo, spam ứng tuyển, hoặc sử dụng hệ thống cho các mục đích vi phạm pháp luật.
          </p>

          <h3 className="text-base font-semibold text-slate-800">4. Dịch vụ AI và Gợi ý tự động</h3>
          <p>
            Tính năng "Đánh giá bằng AI" và Gợi ý CV cung cấp kết quả tham khảo dựa trên thuật toán máy học. Chúng tôi không đảm bảo 100% tính chính xác tuyệt đối và kết quả chỉ mang tính định hướng.
          </p>

          <h3 className="text-base font-semibold text-slate-800">5. Thay đổi điều khoản</h3>
          <p>
            Career Graph có quyền cập nhật hoặc thay đổi các điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên nền tảng.
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
