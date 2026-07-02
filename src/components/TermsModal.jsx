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
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 leading-6 text-slate-600">
            Khi tạo tài khoản hoặc tiếp tục sử dụng CareerGraph, bạn xác nhận rằng mình đã đọc,
            hiểu và đồng ý với các nguyên tắc sử dụng nền tảng dưới đây.
          </p>

          <h3 className="text-base font-semibold text-slate-800">1. Chấp nhận các điều khoản</h3>
          <p>
            Việc đăng ký tài khoản, truy cập hoặc sử dụng nền tảng CareerGraph đồng nghĩa với việc
            bạn chấp nhận các điều khoản áp dụng tại thời điểm sử dụng. Nếu không đồng ý, vui lòng
            không tiếp tục tạo tài khoản hoặc sử dụng dịch vụ.
          </p>

          <h3 className="text-base font-semibold text-slate-800">2. Tài khoản và thông tin cung cấp</h3>
          <p>
            Bạn cam kết cung cấp thông tin đầy đủ, chính xác và cập nhật khi đăng ký. Bạn chịu trách
            nhiệm bảo mật thông tin đăng nhập và mọi hoạt động phát sinh từ tài khoản của mình.
          </p>

          <h3 className="text-base font-semibold text-slate-800">3. Quyền riêng tư và bảo mật</h3>
          <p>
            CareerGraph nỗ lực bảo vệ dữ liệu cá nhân và dữ liệu nghề nghiệp của bạn theo các biện
            pháp bảo mật phù hợp. Thông tin được sử dụng để cung cấp dịch vụ, tối ưu trải nghiệm và
            hỗ trợ kết nối giữa ứng viên với nhà tuyển dụng.
          </p>

          <h3 className="text-base font-semibold text-slate-800">4. Trách nhiệm sử dụng nền tảng</h3>
          <p>
            Bạn không được sử dụng hệ thống để tạo hồ sơ giả mạo, phát tán nội dung sai lệch, gây ảnh
            hưởng đến vận hành dịch vụ hoặc thực hiện bất kỳ hành vi nào vi phạm pháp luật, đạo đức
            nghề nghiệp hay quyền lợi của bên thứ ba.
          </p>

          <h3 className="text-base font-semibold text-slate-800">5. Tính năng AI và nội dung tham khảo</h3>
          <p>
            Một số tính năng như gợi ý CV, đánh giá hồ sơ hoặc đề xuất nội dung có thể được hỗ trợ bởi
            AI. Các kết quả này mang tính tham khảo và không thay thế cho quyết định chuyên môn, tuyển
            dụng hoặc pháp lý của người dùng.
          </p>

          <h3 className="text-base font-semibold text-slate-800">6. Cập nhật điều khoản</h3>
          <p>
            CareerGraph có thể điều chỉnh điều khoản để phù hợp với vận hành thực tế hoặc yêu cầu pháp
            lý. Phiên bản cập nhật có hiệu lực kể từ thời điểm được công bố trên nền tảng.
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
