import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Mock admin functions to fix build errors while keeping the architectural intent
// These would normally interact with Supabase auth and tables

export const getAdminStats = createServerFn({ method: "GET" })
  .handler(async () => {
    return {
      totalArtists: 1,
      activeArtists: 1,
      totalBookings: 0
    };
  });

export const updateSiteContent = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    section_name: z.string(),
    content: z.any()
  }).parse(data))
  .handler(async ({ data }) => {
    console.log("Updating content:", data);
    return { success: true };
  });

export const manageArtist = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    action: z.enum(["create", "update", "delete"]),
    id: z.string().optional(),
    data: z.any().optional()
  }).parse(data))
  .handler(async ({ data }) => {
    console.log("Managing artist:", data);
    return { success: true };
  });
