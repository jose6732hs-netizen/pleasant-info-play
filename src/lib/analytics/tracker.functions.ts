import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { persistEvent, queryEvents, clearEvents } from "./events.server";
import { getOrCreateSession } from "./session.server";

export type EventType = 
  | 'page_view' | 'landing_view' | 'artist_view' | 'artist_click' 
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
  artist_id?: string;
  element_id?: string;
  element_text?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
    ref?: string;
  };
  metadata?: any;
  client_info?: {
    userAgent: string;
    language: string;
    resolution: string;
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
  userAgent: z.string(),
  language: z.string(),
  resolution: z.string(),
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
    // Sync session first
    await getOrCreateSession(data.visitor_id, data.session_id, {
      utm: data.utm,
      device: {
        browser: data.client_info?.userAgent || 'unknown',
        os: 'unknown', // Would parse userAgent here in real app
        resolution: data.client_info?.resolution || 'unknown'
      }
    });

    const event: AnalyticsEvent = {
      id: Math.random().toString(36).substring(2, 15),
      timestamp: new Date().toISOString(),
      ...data,
      type: data.type as EventType
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
