import { useState } from "react";
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  Palette,
  Shield,
  UserRound,
  FileBadge2,
} from "lucide-react";
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-13 items-center rounded-full transition
        ${checked ? "bg-indigo-600" : "bg-slate-300"}`}
      aria-pressed={checked}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition
          ${checked ? "translate-x-5" : "translate-x-1"}`}
      />
    </button>
  );
}

function SideBar({name = "Thịnh Lương Quang",
    active = "profile", // key đang active
    onChangeActive, classNames=""}) {
    const [openNTD, setOpenNTD] = useState(true);
    const [openQLVL, setOpenQLVL] = useState(true);
    const [openSupport, setOpenSupport] = useState(true);

    const [allowSearch, setAllowSearch] = useState(false);

    const Item = ({ icon: Icon, label, k, hasArrow, onClick }) => {
    const isActive = active === k;
    return (
        <button
            onClick={() => {
            onClick?.();
            onChangeActive?.(k);
            }}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-3 text-left
            ${isActive
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-700 hover:bg-slate-100"
            }`}
        >
            <span className="flex items-center gap-3">
            <Icon
                size={20}
                className={`${isActive ? "text-indigo-600" : "text-slate-600"}`}
            />
            <span className="text-[15px] font-medium">{label}</span>
            </span>
            {hasArrow && (
            isActive ? (
                <ChevronRight size={18} className="text-slate-400" />
            ) : (
                <ChevronRight size={18} className="text-slate-400" />
            )
            )}
        </button>
    );
    };

    const SubItem = ({ label, k }) => (
        <button
        onClick={() => onChangeActive?.(k)}
        className="w-full text-left pl-11 pr-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
        >
        {label}
        </button>
    );
    return ( 
        <aside className={`pl-2 h-[80vh] overflow-y-auto ${classNames}`}>
            <div className="rounded-2xl bg-white shadow-sm p-4">
                {/* Header tên */}
                <h2 className="text-lg font-extrabold text-slate-900 mb-3">{name}</h2>

                {/* Toggle cho phép NTD tìm */}
                <div className="mb-5 rounded-lg bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1),0_0_20px_rgba(0,0,0,0.1)] p-3 flex items-center justify-between gap-2">
                <span className="text-sm text-slate-700 leading-snug">
                    Cho phép Nhà tuyển dụng tìm bạn
                </span>
                <Toggle checked={allowSearch} onChange={setAllowSearch} />
                </div>

                {/* Menu */}
                <nav className="space-y-1">
                <Item
                    icon={FileBadge2}
                    label="Hồ sơ của tôi"
                    k="profile"
                />
                <Item
                    icon={Palette}
                    label="Trang trí CV"
                    k="decorate"
                />
                <button
                    onClick={() => setOpenQLVL((v) => !v)}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-3 text-left text-slate-700 hover:bg-slate-100"
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
                    <SubItem label="Việc làm đã ứng tuyển" k="job-applied" />
                    <SubItem label="Việc làm đã lưu" k="job-saved" />
                    <SubItem label="Việc làm chờ ứng tuyển" k="job-waiting" />
                    <SubItem label="Thông báo việc làm" k="job-notification" />
                    </div>
                )}

                {/* Nhóm NTD bạn quan tâm (collapsible) */}
                <button
                    onClick={() => setOpenNTD((v) => !v)}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-3 text-left text-slate-700 hover:bg-slate-100"
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
                    <SubItem label="Nhà tuyển dụng xem hồ sơ bạn" k="ntd-views" />
                    <SubItem label="Nhà tuyển dụng đang theo dõi" k="ntd-follow" />
                    </div>
                )}
                <button
                    onClick={() => setOpenSupport((v) => !v)}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-3 text-left text-slate-700 hover:bg-slate-100"
                >
                    <span className="flex items-center gap-3">
                    <Shield size={20} className="text-slate-600" />
                    <span className="text-[15px] font-medium">NTD bạn quan tâm</span>
                    </span>
                    {openSupport ? (
                    <ChevronDown size={18} className="text-slate-400" />
                    ) : (
                    <ChevronRight size={18} className="text-slate-400" />
                    )}
                </button>
                {openSupport && (
                    <div className="mb-1">
                    <SubItem label="Việc làm 24h thông báo" k="support-notification" />
                    <SubItem label="Hướng dẫn sử dụng" k="support-use" />
                    <SubItem label="Cẩm nang nghề nghiệp" k="support-job" />
                    <SubItem label="Trắc nghiệm tính cách" k="personality-test" />
                    </div>
                )}

                <Item
                    icon={UserRound}
                    label="Quản lý tài khoản"
                    k="account"
                />
                </nav>
            </div>
            </aside>
     );
}

export default SideBar;
