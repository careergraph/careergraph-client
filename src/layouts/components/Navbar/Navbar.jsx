import { MenuIcon, XIcon, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { navLinks } from "../../../data/navLinks";
import logoSvg from "../../../assets/logo.svg";
import { useAuthStore } from "~/store/authStore";
import NotificationBell from "./NotificationBell";
import UserAvatar from "./UserAvatar";


export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const { isAuthenticated, authInitializing } = useAuthStore();
  useEffect(() => {
    if (openMobileMenu) {
      document.body.classList.add("max-md:overflow-hidden");
    } else {
      document.body.classList.remove("max-md:overflow-hidden");
    }
  }, [openMobileMenu]);

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
        {navLinks.map((link) => {
          const isActive = location.pathname === link.href;
          const hasSubLinks = link.subLinks && link.subLinks.length > 0;
          const isSubLinkActive = hasSubLinks && link.subLinks.some(sub => location.pathname === sub.href);

          if (hasSubLinks) {
            return (
              <div
                key={link.name}
                className="relative group"
                onMouseEnter={() => setOpenSubmenu(link.name)}
                onMouseLeave={() => setOpenSubmenu(null)}
              >
                <button className={`flex items-center gap-1 hover:text-indigo-600 transition ${
                  isSubLinkActive ? 'text-indigo-600 font-semibold' : ''
                }`}>
                  {link.name}
                  <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                  {link.subLinks.map((subLink) => {
                    const isSubActive = location.pathname === subLink.href;
                    return (
                      <NavLink
                        key={subLink.name}
                        to={subLink.href}
                        className={`block px-4 py-2.5 text-sm hover:bg-indigo-50 hover:text-indigo-600 transition ${
                          isSubActive ? 'bg-indigo-50 text-indigo-600 font-medium border-l-3 border-indigo-600' : 'text-slate-700'
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
              className={`hover:text-indigo-600 transition relative ${
                isActive ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              {link.name}
              {isActive && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </NavLink>
          );
        })}
      </div>
      {/* Mobile menu */}
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center gap-6 text-lg font-medium bg-white/40 backdrop-blur-md md:hidden transition duration-300 ${
          openMobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navLinks.map((link) => {
          const hasSubLinks = link.subLinks && link.subLinks.length > 0;
          
          if (hasSubLinks) {
            return (
              <div key={link.name} className="flex flex-col items-center gap-3">
                <button
                  onClick={() => setOpenSubmenu(openSubmenu === link.name ? null : link.name)}
                  className="flex items-center gap-2 text-slate-800 font-medium"
                >
                  {link.name}
                  <ChevronDown size={18} className={`transition-transform ${openSubmenu === link.name ? 'rotate-180' : ''}`} />
                </button>
                
                {openSubmenu === link.name && (
                  <div className="flex flex-col gap-2 pl-4">
                    {link.subLinks.map((subLink) => {
                      const isSubActive = location.pathname === subLink.href;
                      return (
                        <NavLink
                          key={subLink.name}
                          to={subLink.href}
                          onClick={() => setOpenMobileMenu(false)}
                          className={`text-base ${isSubActive ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
                        >
                          {subLink.name}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = location.pathname === link.href;
          return (
            <NavLink 
              key={link.name} 
              to={link.href}
              onClick={() => setOpenMobileMenu(false)}
              className={isActive ? 'text-indigo-600 font-semibold' : ''}
            >
              {link.name}
            </NavLink>
          );
        })}
        { !authInitializing && (
          isAuthenticated ? (
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <NotificationBell />
              <UserAvatar />
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
        {!authInitializing&& (
          isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3">
                <NotificationBell />
                <UserAvatar />
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
