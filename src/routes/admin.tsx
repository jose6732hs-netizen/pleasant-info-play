import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logoAsset from "@/assets/logo-completa.png.asset.json";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    // Basic guard for client-side routing
    if (typeof window !== 'undefined' && !localStorage.getItem("064_auth_token")) {
      throw redirect({ to: "/auth" });
    }
  },
  component: AdminLayout,
});

import { Outlet } from "@tanstack/react-router";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row">
      <Outlet />
    </div>
  );
}
