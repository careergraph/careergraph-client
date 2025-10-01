import DefaultLayout from "~/layouts/DefaultLayout";
import SideBar from "~/components/ProfileDashboard/SideBar";

function ProfileDashboardLayout({children}) {
    return (
    <DefaultLayout>
      <div className="flex bg-slate-50 min-h-[80vh] pt-6">
        <SideBar classNames="flex-1" />

        <main className="flex-[3] flex">
          {children}
        </main>
      </div>
    </DefaultLayout>
  );
}

export default ProfileDashboardLayout;