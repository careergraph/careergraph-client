import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import NotificationDropdown from "~/features/notifications/components/NotificationDropdown";
import { useNotifications } from "~/features/notifications/hooks/useNotifications";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const { unreadCount } = useNotifications();

  const closeDropdown = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-full p-2 transition hover:bg-slate-100"
        aria-expanded={isOpen}
        aria-controls="candidate-notification-dropdown"
        aria-label={`Thông báo${unreadCount > 0 ? ` (${unreadCount} chưa đọc)` : ""}`}
      >
        {unreadCount > 0 ? (
          <>
            <span
              aria-hidden="true"
              className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-500/40 motion-safe:animate-ping"
            />
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-semibold text-white shadow-sm motion-safe:animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          </>
        ) : null}

        <Bell size={22} />
      </button>

      <NotificationDropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        dropdownId="candidate-notification-dropdown"
      />
    </div>
  );
}
