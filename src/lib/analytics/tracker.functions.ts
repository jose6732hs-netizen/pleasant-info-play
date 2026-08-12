import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { persistEvent, queryEvents, clearEvents } from "./events.server";
import { getOrCreateSession } from "./session.server";
import { getGeoInfo } from "./geo.server";
import { getRequest } from "@tanstack/react-start/server";

export type EventType = 
  | 'page_view' | 'landing_view' | 'artist_view' | 'artist_click' 
  | 'artist_video_view' | 'artist_video_play' | 'artist_reaction'
  | 'artist_share' | 'artist_contact' | 'artist_budget_click'
  | 'artist_whatsapp_click' | 'artist_phone_click'
  | 'button_click' | 'offer_view' | 'offer_click' | 'banner_view' 
  | 'banner_click' | 'video_view' | 'video_play' | 'reaction' 
  | 'share' | 'form_start' | 'form_submit' | 'whatsapp_click' 
  | 'phone_click' | 'external_link_click' | 'session_start';

export interface AnalyticsEvent {
  id: string;
  session_id: string;
  visitor_id: string;
  timestamp: string;
  type: EventType;
  path: string;
  artist_id?: string | undefined;
  element_id?: string | undefined;
  element_text?: string | undefined;
  utm?: {
    source?: string | undefined;
    medium?: string | undefined;
    campaign?: string | undefined;
    content?: string | undefined;
    term?: string | undefined;
    ref?: string | undefined;
  } | undefined;
  metadata?: any;
  client_info?: {
    userAgent: string | undefined;
    language: string | undefined;
    resolution: string | undefined;
  } | undefined;
  location?: {
    city?: string | undefined;
    region?: string | undefined;
    region_code?: string | undefined;
    country?: string | undefined;
    country_code?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
    timezone?: string | undefined;
    isp?: string | undefined;
  };
}

const UtmSchema = z.object({
  source: z.string().optional(),
  medium: z.string().optional(),
  campaign: z.string().optional(),
  content: z.string().optional(),
  term: z.string().optional(),
  ref: z.string().optional(),
}).optional();

const ClientInfoSchema = z.object({
  userAgent: z.string().optional(),
  language: z.string().optional(),
  resolution: z.string().optional(),
}).optional();

export const trackRealEvent = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    visitor_id: z.string(),
    session_id: z.string(),
    type: z.string(),
    path: z.string(),
    artist_id: z.string().optional(),
    element_id: z.string().optional(),
    element_text: z.string().optional(),
    utm: UtmSchema,
    metadata: z.any().optional(),
    client_info: ClientInfoSchema,
  }).parse(data))
  .handler(async ({ data }) => {
    // Accessing request in TanStack Start server functions is done via the second argument 'ctx'
    // but the input validator might interfere if not handled correctly.
    // In React Start, you can use getWebRequest from @tanstack/react-start/server
    // Wait, let's try to get it from context if possible or use the helper
    const request = getRequest();

    // Get geo info
    const location = await getGeoInfo(request!);

    // Sync session first
    await getOrCreateSession(data.visitor_id, data.session_id, {
      utm: data.utm as any,
      device: {
        browser: data.client_info?.userAgent || 'unknown',
        os: 'unknown',
        resolution: data.client_info?.resolution || 'unknown'
      },
      location
    });

    const event: AnalyticsEvent = {
      id: Math.random().toString(36).substring(2, 15),
      timestamp: new Date().toISOString(),
      visitor_id: data.visitor_id,
      session_id: data.session_id,
      path: data.path,
      artist_id: data.artist_id,
      element_id: data.element_id,
      element_text: data.element_text,
      utm: data.utm as any,
      metadata: data.metadata,
      client_info: data.client_info as any,
      type: data.type as EventType,
      location
    };

    return await persistEvent(event);
  });

export const getRealAnalyticsEvents = createServerFn({ method: "GET" })
  .handler(async () => {
    return await queryEvents();
  });

export const clearRealAnalyticsEvents = createServerFn({ method: "POST" })
  .handler(async () => {
    return await clearEvents();
  });
