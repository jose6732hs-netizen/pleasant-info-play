import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  type: "page_view" | "click" | "filter" | "modal_open" | "session_start";
  path: string;
  elementId?: string;
  elementText?: string;
  metadata?: Record<string, any>;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  clientInfo?: {
    userAgent: string;
    language: string;
    screenResolution: string;
    city?: string;
    region?: string;
    country?: string;
  };
}

// In a real app, this would save to a database.
const events: AnalyticsEvent[] = [];

export const trackEvent = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    type: z.enum(["page_view", "click", "filter", "modal_open", "session_start"]),
    path: z.string(),
    elementId: z.string().optional(),
    elementText: z.string().optional(),
    metadata: z.record(z.any()).optional(),
    utm: z.object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      term: z.string().optional(),
      content: z.string().optional(),
    }).optional(),
    clientInfo: z.object({
      userAgent: z.string(),
      language: z.string(),
      screenResolution: z.string(),
      city: z.string().optional(),
      region: z.string().optional(),
      country: z.string().optional(),
    }).optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    // Explicitly destructure to handle exactOptionalPropertyTypes
    const newEvent: AnalyticsEvent = {
      id: Math.random().toString(36).substring(2, 15),
      timestamp: new Date().toISOString(),
      type: data.type,
      path: data.path,
      elementId: data.elementId ?? undefined,
      elementText: data.elementText ?? undefined,
      metadata: data.metadata ?? undefined,
      utm: data.utm ? {
        source: data.utm.source ?? undefined,
        medium: data.utm.medium ?? undefined,
        campaign: data.utm.campaign ?? undefined,
        term: data.utm.term ?? undefined,
        content: data.utm.content ?? undefined,
      } : undefined,
      clientInfo: data.clientInfo ? {
        userAgent: data.clientInfo.userAgent,
        language: data.clientInfo.language,
        screenResolution: data.clientInfo.screenResolution,
        city: data.clientInfo.city ?? undefined,
        region: data.clientInfo.region ?? undefined,
        country: data.clientInfo.country ?? undefined,
      } : undefined,
    };
    
    console.log("[Analytics Event]:", newEvent);
    events.push(newEvent);
    
    return { success: true };
  });

export const getAnalyticsEvents = createServerFn({ method: "GET" })
  .handler(async () => {
    return events;
  });
