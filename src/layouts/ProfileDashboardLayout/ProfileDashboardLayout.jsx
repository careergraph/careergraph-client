import DefaultLayout from "~/layouts/DefaultLayout";
import SideBar from "~/components/ProfileDashboard/Sidebar";
import { useLocation } from "react-router-dom";

function ProfileDashboardLayout({children}) {
    const { pathname } = useLocation();
    const isMessagesPage = pathname.startsWith("/messages");

    return (
    <DefaultLayout>
      <div className={isMessagesPage
        ? "flex h-full min-h-0 bg-slate-50 pt-4 lg:pt-6"
        : "flex bg-slate-50 min-h-[80vh] pt-4 lg:pt-6"}>
        {isMessagesPage ? (
          <SideBar classNames="hidden lg:block lg:w-80 lg:flex-none lg:h-full" />
        ) : (
          <SideBar classNames="flex-1" />
        )}

        <main className={isMessagesPage
          ? "flex min-w-0 flex-1 lg:flex-[3] min-h-0 overflow-hidden"
          : "flex min-w-0 flex-1 lg:flex-[3]"}>
          {children}
        </main>
      </div>
    </DefaultLayout>
  );
}

export default ProfileDashboardLayout;