import { createFileRoute, redirect, Outlet, useLocation } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/AdminSidebar";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    if (typeof window !== 'undefined' && !localStorage.getItem("064_auth_token")) {
      throw redirect({ to: "/auth" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row">
      <AdminSidebar currentPath={location.pathname} />
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
