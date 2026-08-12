import { createServerFn } from "@tanstack/react-start";

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

export const getAdminNotifications = createServerFn({ method: "GET" })
  .handler(async () => {
    return [];
  });
