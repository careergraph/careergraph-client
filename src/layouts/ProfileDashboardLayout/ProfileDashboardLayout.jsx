import DefaultLayout from "~/layouts/DefaultLayout";
import SideBar from "~/components/ProfileDashboard/Sidebar";
import { useLocation } from "react-router-dom";

function ProfileDashboardLayout({children}) {
    const { pathname } = useLocation();
    const isMessagesPage = pathname.startsWith("/messages");

    return (
    <DefaultLayout>
      <div className="flex bg-slate-50 min-h-[80vh] pt-4 lg:pt-6">
        {isMessagesPage ? (
          <SideBar classNames="hidden lg:block lg:w-80 lg:flex-none" />
        ) : (
          <SideBar classNames="flex-1" />
        )}

        <main className="flex min-w-0 flex-1 lg:flex-[3]">
          {children}
        </main>
      </div>
    </DefaultLayout>
  );
}

export default ProfileDashboardLayout;