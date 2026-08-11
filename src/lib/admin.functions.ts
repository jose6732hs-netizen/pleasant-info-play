import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

// Middleware to check if user is admin
const requireAdmin = async (ctx: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Response("Unauthorized", { status: 401 });

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .single();

  if (!roleData) throw new Response("Forbidden", { status: 403 });
  return { user };
};

export const getAdminStats = createServerFn({ method: "GET" })
  .handler(async () => {
    await requireAdmin({});
    
    const [artistsCount, activeArtistsCount, bookingsCount] = await Promise.all([
      supabase.from("artists").select("*", { count: "exact", head: true }),
      supabase.from("artists").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("booking_requests").select("*", { count: "exact", head: true })
    ]);

    return {
      totalArtists: artistsCount.count || 0,
      activeArtists: activeArtistsCount.count || 0,
      totalBookings: bookingsCount.count || 0
    };
  });

export const updateSiteContent = createServerFn({ method: "POST" })
  .input(z.object({
    section_name: z.string(),
    content: z.any()
  }))
  .handler(async ({ data }) => {
    await requireAdmin({});
    const { error } = await supabase
      .from("site_content")
      .upsert({ section_name: data.section_name, content: data.content }, { onConflict: "section_name" });
    
    if (error) throw error;
    return { success: true };
  });

export const manageArtist = createServerFn({ method: "POST" })
  .input(z.object({
    action: z.enum(["create", "update", "delete"]),
    id: z.string().uuid().optional(),
    data: z.any().optional()
  }))
  .handler(async ({ data }) => {
    await requireAdmin({});
    
    if (data.action === "create") {
      const { error } = await supabase.from("artists").insert([data.data]);
      if (error) throw error;
    } else if (data.action === "update") {
      const { error } = await supabase.from("artists").update(data.data).eq("id", data.id!);
      if (error) throw error;
    } else if (data.action === "delete") {
      const { error } = await supabase.from("artists").delete().eq("id", data.id!);
      if (error) throw error;
    }

    return { success: true };
  });
