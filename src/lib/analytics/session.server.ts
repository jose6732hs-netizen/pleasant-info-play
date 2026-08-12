export interface UserSession {
  visitor_id: string;
  session_id: string;
  first_seen: string;
  last_activity: string;
  utm: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
    ref?: string;
  };
  device: {
    browser: string;
    os: string;
    resolution: string;
  };
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

let sessionsStore: Map<string, UserSession> = new Map();

export const getOrCreateSession = async (visitorId: string, sessionId: string, data: Partial<UserSession>) => {
  const key = `${visitorId}:${sessionId}`;
  if (!sessionsStore.has(key)) {
    sessionsStore.set(key, {
      visitor_id: visitorId,
      session_id: sessionId,
      first_seen: new Date().toISOString(),
      last_activity: new Date().toISOString(),
      utm: data.utm || {},
      device: data.device || { browser: 'unknown', os: 'unknown', resolution: 'unknown' },
      ...data
    } as UserSession);
  } else {
    const session = sessionsStore.get(key)!;
    session.last_activity = new Date().toISOString();
    sessionsStore.set(key, session);
  }
  return sessionsStore.get(key);
};
