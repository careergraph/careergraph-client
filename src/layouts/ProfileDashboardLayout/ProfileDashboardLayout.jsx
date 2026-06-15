import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SideBar from "~/components/ProfileDashboard/Sidebar";
import DefaultLayout from "~/layouts/DefaultLayout";

function ProfileDashboardLayout({ children }) {
  const { pathname } = useLocation();
  const isMessagesPage = pathname.startsWith("/messages");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  if (isMessagesPage) {
    return (
      <DefaultLayout>
        <div className="mx-auto flex h-full min-h-0 w-full max-w-[1440px] gap-4 bg-slate-50 pt-4 lg:gap-6 lg:pt-6">
          <SideBar classNames="hidden lg:block lg:w-80 lg:flex-none lg:h-full" />
          <main className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[1440px] pb-6 pt-4 lg:pt-6">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden">
          <div>
            <div className="text-sm font-semibold text-slate-900">Khu vực hồ sơ</div>
            <div className="text-xs text-slate-500">
              Quản lý hồ sơ, việc làm và tài khoản
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <Menu size={18} />
            <span>Menu</span>
          </button>
        </div>

        <div className="flex min-h-[calc(100dvh-11rem)] gap-4 lg:gap-6">
          <SideBar
            classNames="hidden lg:block lg:w-[320px] lg:flex-none"
            isMobileOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
          />

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default ProfileDashboardLayout;
