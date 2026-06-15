import { useState, useEffect } from "react";
import AvatarUser from "~/components/DefaultData/AvatarUser";
import ProfileDropdown from "~/components/ProfileMenu/ProfileDropdown";
import { useUserStore } from "~/stores/userStore";

export default function UserAvatar({ compact = false }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user } = useUserStore();

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(".user-avatar-container")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <div className="relative user-avatar-container">
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className={`flex items-center rounded-full transition hover:bg-slate-100 ${
          compact ? "gap-2 px-2 py-1.5 lg:px-3" : "gap-2 px-4 py-2"
        }`}
      >
        {user?.avatar ? (
          <img 
            src={user.avatar} 
            alt={user?.firstName ?? "avatar"} 
            className="w-9 h-9 object-cover rounded-full"
          />
        ) : (
          <AvatarUser size={9} />
        )}

        <span
          className={`truncate text-sm font-medium text-gray-800 ${
            compact ? "hidden max-w-[96px] xl:inline" : "max-w-[120px]"
          }`}
        >
          {user?.firstName || "Người dùng"}
        </span>
      </button>

      {/* Dropdown menu */}
      {showUserMenu && <ProfileDropdown />}
    </div>
  );
}
