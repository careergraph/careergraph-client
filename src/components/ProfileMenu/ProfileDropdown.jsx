import {
  User,
  Settings,
  Briefcase,
  FileText,
  Heart,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "~/stores/authStore";

export default function ProfileDropdown() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const items = [
    {
      label: "Thông tin cá nhân",
      icon: <User size={20} />,
      onClick: () => navigate("/profile"),
    },
    {
      label: "Quản lý tài khoản",
      icon: <Settings size={18} />,
      onClick: () => navigate("/account"),
    },
    {
      label: "Quản lý việc làm",
      icon: <Briefcase size={18} />,
      onClick: () => {},
    },
    { label: "Tạo CV", icon: <FileText size={18} />, onClick: () => {} },
    { label: "NTD quan tâm", icon: <Heart size={18} />, onClick: () => {} },
    {
      label: "Đăng xuất",
      icon: <LogOut size={18} />,
      onClick: () => logout(),
      danger: true,
    },
  ];

  return (
    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-gray-200 z-50 p-2">
      <ul className="flex flex-col divide-y divide-gray-100">
        {items.map((item, idx) => (
          <li key={idx}>
            <button
              onClick={item.onClick}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition
                ${
                  item.danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-gray-700 hover:bg-slate-50"
                }`}
            >
              <span>{item.label}</span>
              <span className={item.danger ? "text-red-500" : "text-gray-500"}>
                {item.icon}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
