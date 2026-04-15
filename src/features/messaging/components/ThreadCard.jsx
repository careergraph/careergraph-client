import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "~/lib/utils";

const STATUS_LABEL = {
  APPLIED: "Đã nộp đơn",
  SCREENING: "Đang sàng lọc",
  INTERVIEW: "Phỏng vấn",
  HR_CONTACTED: "Đã liên hệ HR",
  INTERVIEW_SCHEDULED: "Lịch phỏng vấn",
  INTERVIEW_COMPLETED: "Phỏng vấn hoàn tất",
  TRIAL: "Thử việc",
  OFFER_EXTENDED: "Đã gửi offer",
  OFFER_ACCEPTED: "Đã nhận offer",
  OFFER_DECLINED: "Đã từ chối offer",
  HIRED: "Đã tuyển",
  REJECTED: "Đã từ chối",
  WITHDRAWN: "Đã rút hồ sơ",
  SCHEDULED: "Đã hẹn lịch",
};

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

const toDisplayName = (otherUser) => {
  if (!otherUser) {
    return "Nhà tuyển dụng";
  }

  const fullName = `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim();
  if (fullName) {
    return fullName;
  }

  if (otherUser.displayName && otherUser.displayName.trim()) {
    return otherUser.displayName.trim();
  }

  if (otherUser.email) {
    const localPart = otherUser.email.split("@")[0]?.trim();
    if (localPart) {
      return localPart;
    }
  }

  if (otherUser.id) {
    return `HR-${otherUser.id.slice(0, 6)}`;
  }

  return "Nhà tuyển dụng";
};

const getAvatarFallback = (displayName) => {
  const letter = displayName.trim().charAt(0);
  return letter ? letter.toUpperCase() : "H";
};

export function ThreadCard({ thread, isSelected, onClick }) {
  const companyName = toDisplayName(thread.otherUser);
  const status = thread.application?.status || "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "thread-item-hover flex min-h-22 w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300",
        isSelected
          ? "border-indigo-300 bg-indigo-50"
          : "border-transparent bg-transparent hover:bg-slate-100"
      )}
    >
      <div className="relative mt-0.5 h-11 w-11 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold uppercase text-slate-700">
        {thread.otherUser?.avatarUrl ? (
          <img
            src={thread.otherUser.avatarUrl}
            alt={companyName}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center">
            {getAvatarFallback(companyName)}
          </span>
        )}

        {thread.isOnline ? (
          <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              className={cn(
                "truncate text-sm",
                thread.unreadCount > 0 ? "font-semibold text-slate-900" : "font-medium text-slate-700"
              )}
            >
              {companyName}
            </p>
            <p className="truncate text-xs text-slate-500">HR tuyển dụng</p>
          </div>
          <span className="shrink-0 text-[11px] text-slate-400">
            {toRelativeTime(thread.lastMessageAt)}
          </span>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <p className="truncate text-xs text-slate-600">
            {thread.application?.jobTitle || "Trao đổi tuyển dụng"}
          </p>
          {status ? (
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700">
              {STATUS_LABEL[status] || status}
            </span>
          ) : null}
        </div>

        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className="truncate text-xs text-slate-500">
            {thread.lastMessagePreview || "Bắt đầu cuộc trò chuyện mới"}
          </p>

          {thread.unreadCount > 0 ? (
            <span className="shrink-0 rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-semibold text-white">
              {thread.unreadCount > 99 ? "99+" : thread.unreadCount}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

export default ThreadCard;
