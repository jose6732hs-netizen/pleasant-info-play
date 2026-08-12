import { trackRealEvent } from "./analytics/tracker.functions";

export const getVisitorId = () => {
  if (typeof window === "undefined") return "ssr";
  let vid = localStorage.getItem("064_visitor_id");
  if (!vid) {
    vid = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem("064_visitor_id", vid);
  }
  return vid;
};

export const getSessionId = () => {
  if (typeof window === "undefined") return "ssr";
  let sid = sessionStorage.getItem("064_session_id");
  if (!sid) {
    sid = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    sessionStorage.setItem("064_session_id", sid);
  }
  return sid;
};

export const getUtmParams = () => {
  if (typeof window === "undefined") return {};
  const urlParams = new URLSearchParams(window.location.search);
  
  // Persist UTMs in session storage so they follow the user
  const currentUtms = {
    source: urlParams.get("utm_source") || undefined,
    medium: urlParams.get("utm_medium") || undefined,
    campaign: urlParams.get("utm_campaign") || undefined,
    term: urlParams.get("utm_term") || undefined,
    content: urlParams.get("utm_content") || undefined,
    ref: urlParams.get("ref") || urlParams.get("referrer") || undefined,
  };

  const hasNewUtms = Object.values(currentUtms).some(v => v !== undefined);
  
  if (hasNewUtms) {
    sessionStorage.setItem("064_latest_utm", JSON.stringify(currentUtms));
    return currentUtms;
  }

  const saved = sessionStorage.getItem("064_latest_utm");
  return saved ? JSON.parse(saved) : {};
};

export const getClientInfo = () => {
  if (typeof window === "undefined") return {
    userAgent: "SSR",
    language: "en",
    resolution: "0x0"
  };
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    resolution: `${window.screen.width}x${window.screen.height}`,
  };
};

export const trackEvent = (type: string, data: any = {}) => {
  if (typeof window === "undefined") return;

  trackRealEvent({
    data: {
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      type,
      path: window.location.pathname,
      utm: getUtmParams(),
      client_info: getClientInfo(),
      ...data
    }
  }).catch(err => console.error("[Tracking Error]", err));
};

export const capturePageView = (path: string) => {
  trackEvent('page_view', { path });
};

export const captureClick = (text: string, id?: string, metadata?: any) => {
  trackEvent('click', { element_text: text, element_id: id, metadata });
};

export const trackArtistEvent = (type: EventType, artistId: string, metadata?: any) => {
  trackEvent(type, { artist_id: artistId, metadata });
};

import { EventType } from "./analytics/tracker.functions";
