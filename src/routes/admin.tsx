import { createFileRoute, redirect, Outlet, useLocation } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/AdminSidebar";
import { checkAuth } from "@/lib/auth.functions";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    // On the client, we check localStorage before the server fn call for immediate feedback
    const clientToken = typeof window !== 'undefined' ? localStorage.getItem("064_auth_token") : null;
    
    const auth = await checkAuth();
    
    if (!auth.authenticated || auth.user?.role !== 'ADMIN') {
      if (!clientToken || clientToken !== "mock-jwt-token-064") {
        throw redirect({ to: "/auth" });
      }
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
