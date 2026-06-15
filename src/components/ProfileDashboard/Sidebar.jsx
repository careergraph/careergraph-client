import { createElement, useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  FileBadge2,
  MessageSquareMore,
  Shield,
  UserRound,
  CalendarCheck,
  X,
} from "lucide-react";
import { useUserStore } from "~/stores/userStore";
import { UserAPI } from "~/services/api/user";
import { toast } from "sonner";
import { useMessagingUnread } from "~/features/messaging/hooks/useMessagingUnread";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`relative inline-flex h-7 w-[47px] items-center rounded-full transition ${
        checked ? "bg-indigo-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function SideBar({
  classNames = "",
  isMobileOpen = false,
  onClose,
}) {
  const { pathname } = useLocation();
  const { user } = useUserStore();
  const [openQLVL, setOpenQLVL] = useState(false);
  const [openNTD, setOpenNTD] = useState(false);
  const [allowSearch, setAllowSearch] = useState(false);
  const [allowJobMail, setJobMail] = useState(false);
  const { unreadCount: unreadMessages } = useMessagingUnread();

  const groupRoutes = useMemo(
    () => ({
      qlvl: ["/jobs/applied", "/jobs/saved", "/jobs/waiting", "/jobs/alerts"],
      ntd: ["/employers/views", "/employers/following"],
    }),
    []
  );

  const clickToggleAllowSearch = async () => {
    const res = await UserAPI.setJobSearchStatus();
    setAllowSearch(res.data);
    toast.success("Cập nhật thành công");
  };

  const clickToggleAllowJobMail = async () => {
    const res = await UserAPI.toggleJobMail();
    setJobMail(res.data);
    toast.success("Cập nhật thành công");
  };

  useEffect(() => {
    setOpenQLVL(groupRoutes.qlvl.some((p) => pathname.startsWith(p)));
    setOpenNTD(groupRoutes.ntd.some((p) => pathname.startsWith(p)));
    setAllowSearch(Boolean(user?.isOpenToWork));
    setJobMail(Boolean(user?.isOpenToNotifyNewJob));
  }, [pathname, groupRoutes, user]);

  const activeItemCls = "bg-indigo-50 text-indigo-700";
  const baseItemCls =
    "flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-slate-700 transition hover:bg-slate-100";

  const LinkItem = ({ to, icon, label, has = true, badge = 0 }) => (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) => `${baseItemCls} ${isActive ? activeItemCls : ""}`}
    >
      {({ isActive }) => (
        <>
          <span className="flex min-w-0 items-center gap-3">
            {createElement(icon, {
              size: 20,
              className: isActive ? "text-indigo-600" : "text-slate-500",
            })}
            <span className="text-[15px] font-medium leading-5">{label}</span>
            {badge > 0 ? (
              <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                {badge > 99 ? "99+" : badge}
              </span>
            ) : null}
          </span>
          {has ? <ChevronRight size={18} className="text-slate-400" /> : null}
        </>
      )}
    </NavLink>
  );

  const SubLink = ({ to, label }) => (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) =>
        `block w-full rounded-xl py-2 pl-11 pr-3 text-left transition ${
          isActive ? "bg-indigo-50 font-medium text-indigo-700" : "text-slate-700 hover:bg-slate-100"
        }`
      }
    >
      {label}
    </NavLink>
  );

  const sidebarContent = (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-28">
      <div className="mb-4 flex items-start justify-between gap-3 lg:block">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Career Dashboard
          </div>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {user?.firstName ? `${user?.lastName} ${user?.firstName}` : "Người dùng"}
          </h2>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            aria-label="Đóng menu hồ sơ"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      <div className="mb-5 space-y-3">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
          <span className="text-sm leading-snug text-slate-700">
            Cho phép Nhà tuyển dụng tìm bạn
          </span>
          <Toggle checked={allowSearch} onChange={clickToggleAllowSearch} />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
          <span className="text-sm leading-snug text-slate-700">
            Nhận thông báo việc làm phù hợp
          </span>
          <Toggle checked={allowJobMail} onChange={clickToggleAllowJobMail} />
        </div>
      </div>

      <nav className="space-y-1.5">
        <LinkItem to="/profile" icon={FileBadge2} label="Hồ sơ của tôi" has={false} />
        <LinkItem to="/interviews" icon={CalendarCheck} label="Lịch phỏng vấn" has={false} />
        <LinkItem
          to="/messages"
          icon={MessageSquareMore}
          label="Tin nhắn"
          has={false}
          badge={unreadMessages}
        />

        <button
          type="button"
          onClick={() => setOpenQLVL((value) => !value)}
          aria-expanded={openQLVL}
          className={baseItemCls}
        >
          <span className="flex items-center gap-3">
            <BriefcaseBusiness size={20} className="text-slate-500" />
            <span className="text-[15px] font-medium">Quản lý việc làm</span>
          </span>
          {openQLVL ? (
            <ChevronDown size={18} className="text-slate-400" />
          ) : (
            <ChevronRight size={18} className="text-slate-400" />
          )}
        </button>
        {openQLVL ? (
          <div className="mb-1 space-y-1">
            <SubLink to="/jobs/applied" label="Việc làm đã ứng tuyển" />
            <SubLink to="/jobs/saved" label="Việc làm đã lưu" />
            <SubLink to="/jobs/waiting" label="Việc làm chờ ứng tuyển" />
            <SubLink to="/jobs/alerts" label="Thông báo việc làm" />
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setOpenNTD((value) => !value)}
          aria-expanded={openNTD}
          className={baseItemCls}
        >
          <span className="flex items-center gap-3">
            <Shield size={20} className="text-slate-500" />
            <span className="text-[15px] font-medium">NTD bạn quan tâm</span>
          </span>
          {openNTD ? (
            <ChevronDown size={18} className="text-slate-400" />
          ) : (
            <ChevronRight size={18} className="text-slate-400" />
          )}
        </button>
        {openNTD ? (
          <div className="mb-1 space-y-1">
            <SubLink to="/employers/views" label="Nhà tuyển dụng xem hồ sơ bạn" />
            <SubLink to="/employers/following" label="Nhà tuyển dụng đang theo dõi" />
          </div>
        ) : null}

        <LinkItem to="/account" icon={UserRound} label="Quản lý tài khoản" has={false} />
      </nav>
    </div>
  );

  return (
    <>
      <aside className={`hidden lg:block ${classNames}`}>{sidebarContent}</aside>

      {onClose ? (
        <div
          className={`fixed inset-0 z-50 lg:hidden ${
            isMobileOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`absolute inset-0 bg-slate-950/35 transition ${
              isMobileOpen ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Đóng menu hồ sơ"
          />
          <aside
            className={`absolute inset-y-0 left-0 w-full max-w-[360px] p-3 transition ${
              isMobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {sidebarContent}
          </aside>
        </div>
      ) : null}
    </>
  );
}
