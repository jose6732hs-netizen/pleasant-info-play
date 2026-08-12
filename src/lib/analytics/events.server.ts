import { AnalyticsEvent } from "./tracker.functions";

// In-memory persistent storage for development (mimicking a database)
// In production with Lovable Cloud, this would be context.supabase.from('analytics_events')
let eventsStore: AnalyticsEvent[] = [];

export const persistEvent = async (event: AnalyticsEvent) => {
  eventsStore.push({
    ...event,
    timestamp: event.timestamp || new Date().toISOString()
  });
  return { success: true };
};

export const queryEvents = async (filters: any = {}) => {
  let result = [...eventsStore];
  if (filters.type && filters.type !== 'all') {
    result = result.filter(e => e.type === filters.type);
  }
  return result;
};

export const clearEvents = async () => {
  eventsStore = [];
  return { success: true };
};
