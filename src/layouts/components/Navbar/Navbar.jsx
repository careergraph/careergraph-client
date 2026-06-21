import {
  BriefcaseBusiness,
  ChevronDown,
  Info,
  LogIn,
  LogOut,
  MenuIcon,
  MessageSquareMore,
  PanelTopOpen,
  UserRound,
  XIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  primaryNavLinks,
  secondaryNavLinks,
} from "../../../data/navLinks";
import logoSvg from "../../../assets/logo.svg";
import { useAuthStore } from "~/stores/authStore";
import NotificationBell from "./NotificationBell";
import UserAvatar from "./UserAvatar";
import { useMessagingUnread } from "~/features/messaging/hooks/useMessagingUnread";
import TermsModal from "~/components/TermsModal";

const secondaryNavIcons = {
  "Cẩm nang": BriefcaseBusiness,
  "Giới thiệu": Info,
};

function isLinkActive(pathname, link) {
  if (link.href) {
    return pathname === link.href || pathname.startsWith(`${link.href}/`);
  }

  if (link.subLinks?.length) {
    return link.subLinks.some(
      (subLink) => pathname === subLink.href || pathname.startsWith(`${subLink.href}/`)
    );
  }

  return false;
}

function SecondaryMenu({ links, pathname, onNavigate, onOpenTerms }) {
  return (
    <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/8">
      {links.map((link) => {
        const Icon = secondaryNavIcons[link.name] || PanelTopOpen;
        const active = isLinkActive(pathname, link);

        if (link.name === "Điều khoản") {
          return (
            <button
              key={link.name}
              onClick={() => {
                onNavigate();
                if (onOpenTerms) onOpenTerms();
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition text-slate-700 hover:bg-slate-50`}
            >
              <Icon size={17} className="text-slate-400" />
              <span>{link.name}</span>
            </button>
          );
        }

        return (
          <NavLink
            key={link.name}
            to={link.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
              active
                ? "bg-indigo-50 font-semibold text-indigo-700"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Icon size={17} className={active ? "text-indigo-600" : "text-slate-400"} />
            <span>{link.name}</span>
          </NavLink>
        );
      })}
    </div>
  );
}

export default function Navbar() {
  const hrSiteUrl = import.meta.env.VITE_HR_SITE_URL || "https://hr.thinz.io.vn";
  const navigate = useNavigate();
  const location = useLocation();
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [openMoreMenu, setOpenMoreMenu] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);

  const { isAuthenticated, authInitializing, logout } = useAuthStore();
  const { unreadCount: unreadMessages } = useMessagingUnread({
    autoStart: isAuthenticated,
  });

  const mobilePrimaryLinks = useMemo(
    () => [...primaryNavLinks, ...secondaryNavLinks],
    []
  );

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", openMobileMenu);
    return () => document.body.classList.remove("overflow-hidden");
  }, [openMobileMenu]);

  useEffect(() => {
    if (!openMobileMenu) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpenMobileMenu(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openMobileMenu]);

  useEffect(() => {
    setOpenMobileMenu(false);
    setOpenSubmenu(null);
    setOpenMoreMenu(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const mobileMenu =
    typeof document !== "undefined"
      ? createPortal(
          <div
            className={`fixed inset-0 z-[120] md:hidden ${
              openMobileMenu ? "pointer-events-auto" : "pointer-events-none"
            }`}
            aria-hidden={!openMobileMenu}
          >
            <div
              className={`absolute inset-0 bg-white transition-opacity duration-200 ${
                openMobileMenu ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`absolute inset-0 flex flex-col bg-white px-5 pb-6 pt-5 transition-transform duration-300 ${
                openMobileMenu ? "translate-x-0" : "translate-x-full"
              }`}
              role="dialog"
              aria-modal="true"
              aria-label="Menu điều hướng trên điện thoại"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Điều hướng</div>
                  <div className="text-xs text-slate-500">
                    Ưu tiên các tác vụ chính trên mobile
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100"
                  onClick={() => setOpenMobileMenu(false)}
                  aria-label="Đóng menu"
                >
                  <XIcon size={20} />
                </button>
              </div>

              <div className="mt-5 flex-1 space-y-2 overflow-y-auto">
                {mobilePrimaryLinks.map((link) => {
                  const hasSubLinks = link.subLinks?.length > 0;
                  const active = isLinkActive(location.pathname, link);

                  if (hasSubLinks) {
                    return (
                      <div key={link.name} className="rounded-2xl border border-slate-200 bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenSubmenu(openSubmenu === link.name ? null : link.name)
                          }
                          className={`flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-semibold transition ${
                            active ? "text-indigo-700" : "text-slate-800"
                          }`}
                        >
                          <span>{link.name}</span>
                          <ChevronDown
                            size={18}
                            className={`transition-transform ${
                              openSubmenu === link.name ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {openSubmenu === link.name ? (
                          <div className="space-y-1 border-t border-slate-200 bg-white px-2 py-2">
                            {link.subLinks.map((subLink) => {
                              const subActive =
                                location.pathname === subLink.href ||
                                location.pathname.startsWith(`${subLink.href}/`);

                              return (
                                <NavLink
                                  key={subLink.name}
                                  to={subLink.href}
                                  className={`block rounded-xl px-3 py-3 text-sm transition ${
                                    subActive
                                      ? "bg-indigo-50 font-semibold text-indigo-700"
                                      : "text-slate-700 hover:bg-slate-50"
                                  }`}
                                >
                                  {subLink.name}
                                </NavLink>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    );
                  }

                  if (link.name === "Điều khoản") {
                    return (
                      <button
                        key={link.name}
                        onClick={() => {
                          setOpenMobileMenu(false);
                          setOpenTerms(true);
                        }}
                        className="block w-full text-left rounded-2xl border bg-white px-4 py-3.5 text-sm font-semibold transition border-slate-200 text-slate-800 hover:bg-slate-50"
                      >
                        {link.name}
                      </button>
                    );
                  }

                  return (
                    <NavLink
                      key={link.name}
                      to={link.href}
                      className={`block rounded-2xl border bg-white px-4 py-3.5 text-sm font-semibold transition ${
                        active
                          ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      {link.name}
                    </NavLink>
                  );
                })}
              </div>

              <div className="mt-5 space-y-3 border-t border-slate-200 bg-white pt-5">
                {!authInitializing &&
                  (isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to="/messages"
                          className="relative flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800"
                        >
                          <MessageSquareMore size={18} />
                          <span>Tin nhắn</span>
                          {unreadMessages > 0 ? (
                            <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                              {unreadMessages > 99 ? "99+" : unreadMessages}
                            </span>
                          ) : null}
                        </Link>
                        <Link
                          to="/profile"
                          className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800"
                        >
                          <UserRound size={18} />
                          <span>Hồ sơ</span>
                        </Link>
                      </div>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-700"
                      >
                        <LogOut size={18} />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <a
                        href={hrSiteUrl}
                        className="flex h-11 w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Chuyển sang trang HR
                      </a>
                      <button
                        onClick={() => navigate("/login")}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
                      >
                        <LogIn size={18} />
                        <span>Đăng nhập</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl safe-top">
        <div className="mx-auto flex w-full max-w-[1440px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/home" className="min-w-0 shrink-0">
            <div className="flex items-center gap-3">
              <img
                className="h-9 w-auto shrink-0 sm:h-10"
                src={logoSvg}
                alt="Logo"
                width={140}
                height={40}
                fetchPriority="high"
              />
              <div className="text-lg font-bold leading-none bg-gradient-to-r from-[#583DF2] to-[#F3359D] bg-clip-text text-transparent lg:text-xl">
                careergraph
              </div>
            </div>
          </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex lg:gap-2">
          {primaryNavLinks.map((link) => {
            const hasSubLinks = link.subLinks?.length > 0;
            const active = isLinkActive(location.pathname, link);

            if (hasSubLinks) {
              return (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setOpenSubmenu(link.name)}
                  onMouseLeave={() => setOpenSubmenu(null)}
                >
                  <button
                    type="button"
                    className={`flex h-10 items-center gap-1 rounded-full px-3 text-sm font-medium whitespace-nowrap transition lg:px-4 ${
                      active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {link.name}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        openSubmenu === link.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`absolute left-0 top-full mt-3 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/8 transition ${
                      openSubmenu === link.name
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-1 opacity-0"
                    }`}
                  >
                    {link.subLinks.map((subLink) => {
                      const subActive =
                        location.pathname === subLink.href ||
                        location.pathname.startsWith(`${subLink.href}/`);

                      return (
                        <NavLink
                          key={subLink.name}
                          to={subLink.href}
                          className={`block rounded-xl px-4 py-3 text-sm transition ${
                            subActive
                              ? "bg-indigo-50 font-semibold text-indigo-700"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {subLink.name}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `flex h-10 items-center rounded-full px-3 text-sm font-medium whitespace-nowrap transition lg:px-4 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {link.name}
              </NavLink>
            );
          })}

          <div
            className="relative"
            onMouseEnter={() => setOpenMoreMenu(true)}
            onMouseLeave={() => setOpenMoreMenu(false)}
          >
            <button
              type="button"
              className={`flex h-10 items-center gap-1 rounded-full px-3 text-sm font-medium whitespace-nowrap transition lg:px-4 ${
                secondaryNavLinks.some((link) => isLinkActive(location.pathname, link))
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              Khám phá
              <ChevronDown
                size={16}
                className={`transition-transform ${openMoreMenu ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`transition ${
                openMoreMenu
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-1 opacity-0"
              }`}
            >
              <SecondaryMenu
                links={secondaryNavLinks}
                pathname={location.pathname}
                onNavigate={() => setOpenMoreMenu(false)}
                onOpenTerms={() => setOpenTerms(true)}
              />
            </div>
          </div>
        </div>

        <div className="ml-auto hidden items-center gap-2 md:flex lg:gap-3">
          {!authInitializing &&
            (isAuthenticated ? (
              <>
                <Link
                  to="/messages"
                  className="relative inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-3 text-slate-700 transition hover:bg-slate-100"
                >
                  <MessageSquareMore size={18} />
                  {unreadMessages > 0 ? (
                    <span className="absolute -right-1 -top-1 rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {unreadMessages > 99 ? "99+" : unreadMessages}
                    </span>
                  ) : null}
                </Link>
                <NotificationBell />
                <UserAvatar compact />
              </>
            ) : (
              <>
                <a
                  href={hrSiteUrl}
                  className="inline-flex h-10 items-center rounded-full border border-slate-300 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Sang trang HR
                </a>
                <button
                  onClick={() => navigate("/login")}
                  className="inline-flex h-10 items-center rounded-full border border-indigo-600 px-4 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                >
                  Đăng nhập
                </button>
              </>
            ))}
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          {!authInitializing && isAuthenticated ? <NotificationBell /> : null}
          <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100"
          onClick={() => setOpenMobileMenu(true)}
          aria-label="Mở menu điều hướng"
        >
          <MenuIcon size={20} />
          </button>
        </div>
        </div>
      </nav>
      {mobileMenu}
      <TermsModal open={openTerms} onClose={() => setOpenTerms(false)} />
    </>
  );
}
