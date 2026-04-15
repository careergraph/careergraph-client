import { MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";
import { routes } from "~/config";

export function EmptyInbox() {
  return (
    <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        <MessageSquareText className="h-6 w-6" />
      </div>
      <p className="text-sm font-semibold text-slate-800">Bạn chưa có tin nhắn nào</p>
      <p className="mt-1 text-xs text-slate-500">
        Khi nhà tuyển dụng nhắn tin cho bạn, cuộc trò chuyện sẽ hiển thị ở đây.
      </p>
      <Link
        to={routes.appliedJobs}
        className="mt-4 inline-flex h-11 items-center rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700"
      >
        Xem việc làm đã ứng tuyển
      </Link>
    </div>
  );
}

export default EmptyInbox;
