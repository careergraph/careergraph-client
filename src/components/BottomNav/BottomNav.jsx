import { NavLink, useLocation } from "react-router-dom";
import { Home, MessageSquare, Search, User } from "lucide-react";
import { useMessagingUnread } from "~/features/messaging/hooks/useMessagingUnread";

const NAV_ITEMS = [
  {
    id: "home",
    label: "Trang chu",
    icon: Home,
    to: "/",
    isActive: (pathname) => pathname === "/" || pathname === "/home",
  },
  {
    id: "jobs",
    label: "Viec lam",
    icon: Search,
    to: "/jobs",
    isActive: (pathname) => pathname.startsWith("/jobs"),
  },
  {
    id: "messages",
    label: "Tin nhan",
    icon: MessageSquare,
    to: "/messages",
    isActive: (pathname) => pathname.startsWith("/messages"),
    badge: true,
  },
  {
    id: "profile",
    label: "Ho so",
    icon: User,
    to: "/profile",
    isActive: (pathname) =>
      pathname.startsWith("/profile") ||
      pathname.startsWith("/account") ||
      pathname.startsWith("/interviews") ||
      pathname.startsWith("/employers"),
  },
];

const HIDDEN_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
  "/interview/room",
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const { unreadCount } = useMessagingUnread();

  if (HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-lg md:hidden safe-bottom">
      <div className="flex h-16 items-center">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.isActive(pathname);

          return (
            <NavLink
              key={item.id}
              to={item.to}
              className={`touch-target relative flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition ${
                active ? "text-indigo-600" : "text-slate-400"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "scale-105" : ""}`} />
              <span>{item.label}</span>
              {item.badge && unreadCount > 0 ? (
                <span className="absolute top-2 right-[26%] min-w-4 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
