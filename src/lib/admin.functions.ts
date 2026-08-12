import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getDashboardStats = createServerFn({ method: "GET" })
  .handler(async () => {
    return {
      totalArtists: 0,
      activeProposals: 0,
      confirmedShows: 0,
      monthlyRevenue: 0,
      pendingContracts: 0
    };
  });

// Needed for compatibility with admin dashboard
export const getAdminStats = getDashboardStats;

export const getAdminNotifications = createServerFn({ method: "GET" })
  .handler(async () => {
    return [];
  });

export const getBookingRequests = createServerFn({ method: "GET" })
  .handler(async () => {
    return [];
  });

export const updateBookingRequestStatus = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    id: z.string(),
    status: z.string()
  }).parse(data))
  .handler(async () => {
    return { success: true };
  });
