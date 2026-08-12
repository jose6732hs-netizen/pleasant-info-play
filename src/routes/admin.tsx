import { createFileRoute, redirect, Outlet, useLocation } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/AdminSidebar";
import { checkAuth } from "@/lib/auth.functions";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const auth = await checkAuth();
    
    if (!auth.authenticated || auth.user?.role !== 'ADMIN') {
      // If we're on the client, we still check localStorage for initial redirect, 
      // but the server function checkAuth above is the real security gate.
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
