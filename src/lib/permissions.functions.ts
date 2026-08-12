import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Mock roles & permissions mapping
const ROLES = {
  ADMIN: [
    'dashboard.view', 'analytics.view', 'users.manage', 'artists.manage', 
    'offers.manage', 'banners.manage', 'settings.manage', 'tracking.view', 
    'utm.manage', 'logs.view', 'security.manage'
  ],
  USER: ['dashboard.view']
};

// In real app, this would come from a database query linked to the authenticated user ID
// For this mock, we assume the user role is held in memory or session, which we validate.
// IMPORTANT: Role should be verified on the server side via the session/auth token context.

export const hasPermission = (userRole: 'ADMIN' | 'USER' | undefined, permission: string): boolean => {
  if (!userRole) return false;
  return ROLES[userRole]?.includes(permission) || false;
};

// Secure wrapper for admin server functions
export const requireAdmin = async (userId: string | undefined) => {
    // This is where you would verify against your users database
    // Mock check:
    const { getUsers } = await import("./users.functions");
    const users = await getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user || user.role !== 'ADMIN') {
        throw new Error("Não autorizado: Permissão administrativa necessária.");
    }
    return user;
};
