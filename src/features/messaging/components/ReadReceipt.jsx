import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const toRelativeTime = (dateString) => {
  if (!dateString) {
    return "";
  }

  const parsed = new Date(dateString);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return formatDistanceToNow(parsed, {
    addSuffix: true,
    locale: vi,
  });
};

export function ReadReceipt({ message }) {
  if (message.localStatus === "failed") {
    return (
      <span className="text-[11px] font-medium text-red-500">Gửi thất bại</span>
    );
  }

  if (message.localStatus === "sending") {
    return (
      <span className="text-[11px] font-medium text-slate-400">Đang gửi...</span>
    );
  }

  if (message.isRead) {
    return (
      <span className="text-[11px] font-medium text-emerald-600">
        Đã xem{message.readAt ? ` ${toRelativeTime(message.readAt)}` : ""}
      </span>
    );
  }

  return <span className="text-[11px] font-medium text-slate-400">Đã gửi</span>;
}

export default ReadReceipt;
