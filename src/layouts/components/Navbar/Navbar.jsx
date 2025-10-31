import { MenuIcon, XIcon, User, LogOut, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { navLinks } from "../../../data/navLinks";
import logoSvg from "../../../assets/logo.svg";
import { useAuth } from "../../../contexts/AuthContext";
import ProfileDropdown from "~/components/ProfileMenu/ProfileDropdown";
import AvatarUser from "~/components/DefaultData/AvatarUser";

export default function Navbar() {
  const navigate = useNavigate();
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  console.log(isAuthenticated)
  useEffect(() => {
    if (openMobileMenu) {
      document.body.classList.add("max-md:overflow-hidden");
    } else {
      document.body.classList.remove("max-md:overflow-hidden");
    }
  }, [openMobileMenu]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(".relative")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <nav
      className={`flex items-center justify-between fixed z-50 top-0 w-full px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-slate-200 bg-white/40 ${
        openMobileMenu ? "bg-white/80" : "backdrop-blur"
      }`}
    >
      <Link to="/">
        <div className="flex items-center gap-2">
          <img
            className="h-9 md:h-9.5 w-auto shrink-0"
            src={logoSvg}
            alt="Logo"
            width={140}
            height={40}
            fetchPriority="high"
          />
          <div className="font-bold text-2xl bg-gradient-to-r from-[#583DF2] to-[#F3359D] bg-clip-text text-transparent">
            Career Graph
          </div>
        </div>
      </Link>
      <div className="hidden md:flex flex-1 justify-center items-center gap-8 font-medium">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.href}
            className="hover:text-indigo-600"
          >
            {link.name}
          </NavLink>
        ))}
      </div>
      {/* Mobile menu */}
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center gap-6 text-lg font-medium bg-white/40 backdrop-blur-md md:hidden transition duration-300 ${
          openMobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navLinks.map((link) => (
          <NavLink key={link.name} to={link.href}>
            {link.name}
          </NavLink>
        ))}
        { !isLoading && (
          isAuthenticated ? (
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Nút chuông thông báo */}
              <button className="relative p-2 rounded-full hover:bg-indigo-600 transition">
                <Bell size={20} />
                {/* Badge số thông báo (nếu có) */}
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </button>

              {/* Avatar + tên */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 transition rounded-md"
                >
                  <User size={20} />
                  <span className="text-sm font-medium">
                    {user?.fullName || user?.email}
                  </span>
                </button>

                {/* Dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      {user?.email}
                    </div>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <User size={16} />
                      Thông tin cá nhân
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="hidden md:block hover:bg-slate-100 transition px-4 py-2 border border-indigo-600 rounded-md"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => navigate("/register")}
              className="hidden md:block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md"
            >
              Đăng ký
            </button>
          </>
        )
      )}
        <button
          className="aspect-square size-10 p-1 items-center justify-center bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md flex"
          onClick={() => setOpenMobileMenu(false)}
        >
          <XIcon />
        </button>
      </div>

      {/* Desktop */}
      <div className="flex items-center gap-4">
        {!isLoading&& (
          isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3">
                {/* Nút chuông thông báo */}
                <button className="relative p-2 rounded-full hover:bg-slate-100 transition">
                  <Bell size={22} />
                  {/* Badge số thông báo (nếu có) */}
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                </button>

                {/* Avatar + Tên */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 transition rounded-md"
                  >
                    {user.avatarUrl? (
                      <img src={user.avatarUrl} 
                      alt={user?.firstName ?? "avatar"} className="w-9 h-9 object-cover rounded-full"/>
                      ):(
                        <AvatarUser size={9}/>
                      )
                     }
                    

                    {/* Tên */}
                    <span className="text-sm font-medium text-gray-800 truncate max-w-[120px]">
                      {user?.firstName || "Người dùng"}
                    </span>
                  </button>

                  {/* Dropdown menu */}
                  {showUserMenu && <ProfileDropdown />}
                </div>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="hidden md:block h-9 hover:bg-slate-100 transition px-4 py-2 border border-indigo-600 rounded-md"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => navigate("/register")}
                className="hidden md:block h-9 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md"
              >
                Đăng ký
              </button>
            </>
          )
        )}
        <button
          onClick={() => setOpenMobileMenu(!openMobileMenu)}
          className="md:hidden"
        >
          <MenuIcon size={26} className="active:scale-90 transition" />
        </button>
      </div>
    </nav>
  );
}
