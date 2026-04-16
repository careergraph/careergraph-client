import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, RotateCcw, Undo2 } from "lucide-react";
import ReadReceipt from "~/features/messaging/components/ReadReceipt";
import useUnsendCountdown from "~/features/messaging/hooks/useUnsendCountdown";
import { getJobColor } from "~/features/messaging/utils/jobColor";
import { cn } from "~/lib/utils";

const getDisplayName = (sender = {}) => {
  const fullName = `${sender.firstName || ""} ${sender.lastName || ""}`.trim();
  if (fullName) {
    return fullName;
  }

  if (sender.displayName && sender.displayName.trim()) {
    return sender.displayName.trim();
  }

  if (sender.email) {
    const localPart = sender.email.split("@")[0]?.trim();
    if (localPart) {
      return localPart;
    }
  }

  if (sender.id) {
    return `HR-${sender.id.slice(0, 6)}`;
  }

  return "HR";
};

const avatarFallback = (displayName) => {
  const letter = displayName.trim().charAt(0);
  return letter ? letter.toUpperCase() : "H";
};

const toDisplayTime = (value) => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return format(parsed, "HH:mm, dd/MM", { locale: vi });
};

export function MessageBubble({
  message,
  isOwn,
  showAvatar,
  showReadReceipt = false,
  otherUser,
  onDelete,
  onRetry,
}) {
  const canDelete = isOwn && !message.deleted && !message.id.startsWith("temp-");
  const canRetry = isOwn && message.localStatus === "failed";
  const { canUnsend, secondsLeft, urgent } = useUnsendCountdown(message.createdAt);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const actionMenuRef = useRef(null);

  const sender = otherUser || message.sender;
  const displayName = getDisplayName(sender);

  useEffect(() => {
    if (!isActionMenuOpen) {
      return;
    }

    const handlePointerDown = (event) => {
      if (!actionMenuRef.current) {
        return;
      }

      if (!actionMenuRef.current.contains(event.target)) {
        setIsActionMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsActionMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isActionMenuOpen]);

  return (
    <div
      className={cn(
        "message-bubble-enter flex w-full min-w-0 items-end gap-2",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      {!isOwn && showAvatar ? (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-[11px] font-semibold uppercase text-slate-700">
          {sender?.avatarUrl ? (
            <img src={sender.avatarUrl} alt={displayName} className="h-full w-full object-cover" />
          ) : (
            avatarFallback(displayName)
          )}
        </div>
      ) : !isOwn ? (
        <div className="w-8" />
      ) : null}

      <div
        className={cn(
          "group flex min-w-0 max-w-[85%] flex-col space-y-1 sm:max-w-[82%]",
          isOwn ? "items-end text-right" : "items-start text-left"
        )}
      >
        <div
          className={cn(
            "relative inline-flex w-fit min-w-0 max-w-full rounded-2xl px-3.5 py-2.5 text-sm shadow-sm",
            isOwn ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-800"
          )}
        >
          {canDelete ? (
            <div
              ref={actionMenuRef}
              className="absolute -top-3 right-0 z-20 opacity-0 pointer-events-none transition-opacity duration-150 group-hover:opacity-100 group-hover:pointer-events-auto"
            >
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-slate-700"
                aria-label="Tùy chọn tin nhắn"
                aria-expanded={isActionMenuOpen}
                onClick={() => setIsActionMenuOpen((current) => !current)}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>

              {isActionMenuOpen ? (
                <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-[0_14px_36px_rgba(15,23,42,0.22)]">
                  {canUnsend ? (
                    <button
                      type="button"
                      className="flex h-11 w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 hover:text-red-700"
                      onClick={() => {
                        setIsActionMenuOpen(false);
                        onDelete?.(message.id);
                      }}
                    >
                      <Undo2 className="h-4 w-4" />
                      <span>Gỡ tin nhắn</span>
                      <span
                        className={cn(
                          "ml-auto text-[11px] font-semibold",
                          urgent ? "text-red-500" : "text-slate-400"
                        )}
                      >
                        {secondsLeft}s
                      </span>
                    </button>
                  ) : (
                    <div className="flex h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400">
                      <Undo2 className="h-4 w-4" />
                      <span>Không thể gỡ</span>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          ) : null}

          {canRetry ? (
            <button
              type="button"
              className="absolute -top-2 -right-2 hidden h-6 w-6 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 shadow-sm transition hover:bg-red-100 group-hover:flex"
              onClick={() => onRetry?.(message.id)}
              aria-label="Gửi lại tin nhắn"
              title="Gửi lại"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          ) : null}

          {message.deleted ? (
            <p className="italic opacity-80">Tin nhắn đã được thu hồi</p>
          ) : (
            <p
              className="block max-w-full whitespace-pre-wrap break-words"
              style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
            >
              {message.content}
            </p>
          )}
        </div>

        <div
          className={cn(
            "flex items-center gap-2 text-[11px] text-slate-400",
            isOwn ? "justify-end" : "justify-start"
          )}
        >
          {message.jobContext ? (
            <span className="msg-job-tag">
              <span
                className="job-tag-dot"
                style={{ background: getJobColor(message.jobContext.jobId) }}
              />
              <span>{message.jobContext.jobTitle}</span>
            </span>
          ) : null}
          <span>{toDisplayTime(message.createdAt)}</span>
          {isOwn && showReadReceipt ? <ReadReceipt message={message} /> : null}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
