import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const getSiteContent = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabase
      .from("site_content")
      .select("*");
    
    if (error) throw error;
    return data;
  });

export const getActiveArtists = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabase
      .from("artists")
      .select("*, artist_gallery(*)")
      .eq("status", "active")
      .order("display_order", { ascending: true });
    
    if (error) throw error;
    return data;
  });

export const submitBookingRequest = createServerFn({ method: "POST" })
  .input(z.object({
    name: z.string(),
    company: z.string().optional(),
    whatsapp: z.string(),
    email: z.string().email(),
    city: z.string().optional(),
    state: z.string().optional(),
    event_date: z.string().optional(),
    event_time: z.string().optional(),
    event_type: z.string().optional(),
    artist_id: z.string().uuid().optional(),
    budget: z.string().optional(),
    message: z.string().optional(),
  }))
  .handler(async ({ data }) => {
    const { error } = await supabase
      .from("booking_requests")
      .insert([data]);
    
    if (error) throw error;
    return { success: true };
  });
