import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Bell,
  Briefcase,
  CalendarCheck2,
  CheckCheck,
  Eye,
  MessageSquareText,
  SearchCheck,
  UserRoundPlus,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "~/features/notifications/hooks/useNotifications";

const toRelativeTime = (value) => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "vừa xong";
  }

  return formatDistanceToNow(parsed, {
    addSuffix: true,
    locale: vi,
  });
};

const toDataString = (data, key) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return null;
  }

  const value = data[key];
  if (typeof value === "undefined" || value === null) {
    return null;
  }

  return typeof value === "string" ? value : String(value);
};

const normalizeNavigatePathForCandidate = (rawPath, data) => {
  if (!rawPath || !rawPath.startsWith("/")) {
    return null;
  }

  if (rawPath.startsWith("/messages")) {
    return rawPath;
  }

  if (rawPath.startsWith("/applications/")) {
    const applicationId = rawPath.split("/")[2] || toDataString(data, "applicationId");
    return applicationId
      ? `/jobs/applied?applicationId=${applicationId}`
      : "/jobs/applied";
  }

  return rawPath;
};

const getNavigatePath = (notification) => {
  const explicitPath = toDataString(notification.data, "navigateTo");

  if (explicitPath) {
    const normalizedPath = normalizeNavigatePathForCandidate(
      explicitPath,
      notification.data
    );

    if (normalizedPath) {
      return normalizedPath;
    }
  }

  const threadId = toDataString(notification.data, "threadId");
  const applicationId = toDataString(notification.data, "applicationId");

  switch (notification.type) {
    case "NEW_MESSAGE":
      return threadId ? `/messages?thread=${threadId}` : "/messages";
    case "APPLICATION_STATUS_CHANGED":
    case "APPLICATION_SHORTLISTED":
    case "APPLICATION_REJECTED":
    case "APPLICATION_INTERVIEW_SCHEDULED":
    case "APPLICATION_VIEWED":
      return applicationId
        ? `/jobs/applied?applicationId=${applicationId}`
        : "/jobs/applied";
    default:
      return null;
  }
};

const getNotificationTypeMeta = (type) => {
  switch (type) {
    case "NEW_MESSAGE":
      return {
        icon: <MessageSquareText size={16} />,
        iconClass:
          "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300",
      };
    case "NEW_APPLICATION":
      return {
        icon: <UserRoundPlus size={16} />,
        iconClass:
          "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
      };
    case "APPLICATION_VIEWED":
      return {
        icon: <Eye size={16} />,
        iconClass:
          "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
      };
    case "APPLICATION_SHORTLISTED":
      return {
        icon: <SearchCheck size={16} />,
        iconClass:
          "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300",
      };
    case "APPLICATION_INTERVIEW_SCHEDULED":
      return {
        icon: <CalendarCheck2 size={16} />,
        iconClass:
          "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300",
      };
    case "APPLICATION_REJECTED":
      return {
        icon: <XCircle size={16} />,
        iconClass:
          "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300",
      };
    default:
      return {
        icon: <Briefcase size={16} />,
        iconClass: "bg-slate-100 text-slate-600",
      };
  }
};

export default function NotificationDropdown({
  isOpen,
  onClose,
  dropdownId = "candidate-notification-dropdown",
}) {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    ensureLoaded,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    void ensureLoaded();
  }, [ensureLoaded, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    const navigatePath = getNavigatePath(notification);
    onClose();

    if (navigatePath) {
      navigate(navigatePath);
    }
  };

  return (
    <div
      id={dropdownId}
      className="absolute right-0 mt-2 w-[360px] max-w-[calc(100vw-1rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
      role="dialog"
      aria-label="Danh sách thông báo"
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Thông báo</h3>
          <p className="text-xs text-slate-500">Cập nhật theo thời gian thực</p>
        </div>

        {unreadCount > 0 ? (
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
            onClick={() => {
              void markAllAsRead();
            }}
          >
            Đánh dấu tất cả
          </button>
        ) : null}
      </div>

      <ul className="max-h-[24rem] overflow-y-auto">
        {loading && notifications.length === 0 ? (
          <li className="px-4 py-10 text-center text-sm text-slate-500">
            Đang tải thông báo...
          </li>
        ) : null}

        {!loading && error ? (
          <li className="m-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
            {error}
          </li>
        ) : null}

        {!loading && !error && notifications.length === 0 ? (
          <li className="px-4 py-10 text-center text-slate-500">
            <Bell size={44} className="mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium text-slate-700">Chưa có thông báo nào</p>
            <p className="mt-1 text-xs text-slate-500">
              Khi có cập nhật hệ thống hoặc tin nhắn mới, bạn sẽ thấy tại đây.
            </p>
          </li>
        ) : null}

        {notifications.map((notification) => {
          const { icon, iconClass } = getNotificationTypeMeta(notification.type);

          return (
            <li key={notification.id}>
              <button
                type="button"
                className={`w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${
                  notification.read ? "bg-white" : "bg-indigo-50/60"
                }`}
                onClick={() => {
                  void handleNotificationClick(notification);
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconClass}`}
                    aria-hidden="true"
                  >
                    {icon}
                  </span>

                  <span className="block min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-slate-800">
                        {notification.title}
                      </span>
                      {!notification.read ? (
                        <span className="rounded-full border border-indigo-200 bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                          Mới
                        </span>
                      ) : null}
                    </span>

                    <span className="mt-0.5 block text-xs text-slate-600">
                      {notification.body}
                    </span>

                    <span className="mt-1 block text-[11px] text-slate-400">
                      {toRelativeTime(notification.createdAt)}
                    </span>
                  </span>

                  {!notification.read ? (
                    <span
                      className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between gap-2 border-t border-slate-200 px-4 py-2.5">
        {hasMore ? (
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
            onClick={() => {
              void fetchNotifications({ reset: false });
            }}
          >
            Tải thêm
          </button>
        ) : (
          <span className="text-xs text-slate-400">Đã tải toàn bộ thông báo</span>
        )}

        <button
          type="button"
          onClick={() => {
            onClose();
            navigate("/messages");
          }}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
        >
          <CheckCheck size={14} />
          Mở inbox
        </button>
      </div>
    </div>
  );
}
