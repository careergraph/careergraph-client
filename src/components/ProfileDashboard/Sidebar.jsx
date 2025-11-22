// SideBar.jsx
import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  Palette,
  Shield,
  UserRound,
  FileBadge2,
  Bell
} from "lucide-react";
import { useUserStore } from "~/stores/userStore";

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
}) {
  const { pathname } = useLocation();

  const {user} = useUserStore();
  // Nhóm mặc định đóng. Sẽ mở nếu đang đứng trong route con của nhóm.
  const [openQLVL, setOpenQLVL] = useState(false);
  const [openNTD, setOpenNTD] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);

  const [allowSearch, setAllowSearch] = useState(false);

  // Map route con của từng nhóm để auto mở nhóm tương ứng khi người dùng vào trang con
  const groupRoutes = useMemo(
    () => ({
      qlvl: ["/jobs/applied", "/jobs/saved", "/jobs/waiting", "/jobs/alerts"],
      ntd: ["/employers/views", "/employers/following"],
      support: [
        "/support/notifications",
        "/support/guide",
        "/support/career-handbook",
        "/support/personality",
      ],
    }),
    []
  );

  useEffect(() => {
    setOpenQLVL(groupRoutes.qlvl.some((p) => pathname.startsWith(p)));
    setOpenNTD(groupRoutes.ntd.some((p) => pathname.startsWith(p)));
    setOpenSupport(groupRoutes.support.some((p) => pathname.startsWith(p)));
  }, [pathname, groupRoutes]);

  const activeItemCls = "bg-indigo-50 text-indigo-700";
  const baseItemCls =
    "w-full flex items-center justify-between rounded-xl px-3 py-3 text-left text-slate-700 hover:bg-slate-100";

  const LinkItem = ({ to, label, has = true }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${baseItemCls} ${isActive ? activeItemCls : ""}`
      }
    >
      {({ isActive }) => (
        <>
          <span className="flex items-center gap-3">
            <Icon size={20} className={isActive ? "text-indigo-600" : "text-slate-600"} />
            <span className="text-[15px] font-medium">{label}</span>
          </span>
          {has&&<ChevronRight size={18} className="text-slate-400" />}
        </>
      )}
    </NavLink>
  );

  const SubLink = ({ to, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-full block text-left pl-11 pr-3 py-2 rounded-lg hover:bg-slate-100 ${
          isActive ? "text-indigo-700 font-medium" : "text-slate-700"
        }`
      }
    >
      {label}
    </NavLink>
  );

 
  return (
    <aside className={`pl-2 ${classNames}`}>
      <div className="rounded-2xl bg-white shadow-sm p-4">
        {/* Header tên */}
        <h2 className="text-lg font-extrabold text-slate-900 mb-3">
          {user?.firstName ? `${user?.lastName} ${user?.firstName} `  : "Người dùng"}
        </h2>

        {/* Toggle cho phép NTD tìm */}
        <div className="mb-5 rounded-lg bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1),0_0_20px_rgba(0,0,0,0.1)] p-3 flex items-center justify-between gap-2">
          <span className="text-sm text-slate-700 leading-snug">
            Cho phép Nhà tuyển dụng tìm bạn
          </span>
          <Toggle checked={allowSearch} onChange={setAllowSearch} />
        </div>

        {/* Menu */}
        <nav className="space-y-1">
          <LinkItem to="/profile" icon={FileBadge2} label="Hồ sơ của tôi" has={false} />
          <LinkItem to="/cv/decorate" icon={Palette} label="Trang trí CV" has={false} />

          {/* Quản lý việc làm */}
          <button
            type="button"
            onClick={() => setOpenQLVL((v) => !v)}
            aria-expanded={openQLVL}
            className={baseItemCls}
          >
            <span className="flex items-center gap-3">
              <BriefcaseBusiness size={20} className="text-slate-600" />
              <span className="text-[15px] font-medium">Quản lý việc làm</span>
            </span>
            {openQLVL ? (
              <ChevronDown size={18} className="text-slate-400" />
            ) : (
              <ChevronRight size={18} className="text-slate-400" />
            )}
          </button>
          {openQLVL && (
            <div className="mb-1">
              <SubLink to="/jobs/applied" label="Việc làm đã ứng tuyển" />
              <SubLink to="/jobs/saved" label="Việc làm đã lưu" />
              <SubLink to="/jobs/waiting" label="Việc làm chờ ứng tuyển" />
              <SubLink to="/jobs/alerts" label="Thông báo việc làm" />
            </div>
          )}

          {/* NTD bạn quan tâm */}
          <button
            type="button"
            onClick={() => setOpenNTD((v) => !v)}
            aria-expanded={openNTD}
            className={baseItemCls}
          >
            <span className="flex items-center gap-3">
              <Shield size={20} className="text-slate-600" />
              <span className="text-[15px] font-medium">NTD bạn quan tâm</span>
            </span>
            {openNTD ? (
              <ChevronDown size={18} className="text-slate-400" />
            ) : (
              <ChevronRight size={18} className="text-slate-400" />
            )}
          </button>
          {openNTD && (
            <div className="mb-1">
              <SubLink to="/employers/views" label="Nhà tuyển dụng xem hồ sơ bạn" />
              <SubLink to="/employers/following" label="Nhà tuyển dụng đang theo dõi" />
            </div>
          )}

          {/* Hỗ trợ / tài nguyên */}
          <button
            type="button"
            onClick={() => setOpenSupport((v) => !v)}
            aria-expanded={openSupport}
            className={baseItemCls}
          >
            <span className="flex items-center gap-3">
              <Bell size={20} className="text-slate-600" />
              <span className="text-[15px] font-medium">Hỗ trợ & Tài nguyên</span>
            </span>
            {openSupport ? (
              <ChevronDown size={18} className="text-slate-400" />
            ) : (
              <ChevronRight size={18} className="text-slate-400" />
            )}
          </button>
          {openSupport && (
            <div className="mb-1">
              <SubLink to="/support/notifications" label="Việc làm 24h thông báo" />
              <SubLink to="/support/guide" label="Hướng dẫn sử dụng" />
              <SubLink to="/support/career-handbook" label="Cẩm nang nghề nghiệp" />
              <SubLink to="/support/personality" label="Trắc nghiệm tính cách" />
            </div>
          )}

          <LinkItem to="/account" icon={UserRound} label="Quản lý tài khoản" has={false} />
        </nav>
      </div>
    </aside>
  );
}
