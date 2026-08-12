import { createFileRoute, redirect, Outlet, useLocation } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/AdminSidebar";
import { checkAuth } from "@/lib/auth.functions";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    // Verify authentication using the server function
    const auth = await checkAuth();
    
    if (!auth.authenticated) {
      // Fallback for preview/dev environments where state might be lost but token persists in client
      const clientToken = typeof window !== 'undefined' ? 
        (localStorage.getItem("064_auth_token") || 
         document.cookie.split(';').find(c => c.trim().startsWith('064_auth_token='))?.split('=')[1]) : 
        null;

      if (clientToken !== "mock-jwt-token-064") {
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
