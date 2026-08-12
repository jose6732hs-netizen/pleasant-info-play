import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  type: "page_view" | "click" | "filter" | "modal_open" | "session_start";
  path: string;
  elementId?: string | undefined;
  elementText?: string | undefined;
  metadata?: Record<string, any> | undefined;
  utm?: {
    source?: string | undefined;
    medium?: string | undefined;
    campaign?: string | undefined;
    term?: string | undefined;
    content?: string | undefined;
  } | undefined;
  clientInfo?: {
    userAgent: string;
    language: string;
    screenResolution: string;
    city?: string | undefined;
    region?: string | undefined;
    country?: string | undefined;
  } | undefined;
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
    const newEvent: AnalyticsEvent = {
      id: Math.random().toString(36).substring(2, 15),
      timestamp: new Date().toISOString(),
      ...data,
    };
    
    console.log("[Analytics Event]:", newEvent);
    events.push(newEvent);
    
    return { success: true };
  });

export const getAnalyticsEvents = createServerFn({ method: "GET" })
  .handler(async () => {
    return events;
  });
