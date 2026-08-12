import { trackEvent } from "./analytics.functions";

export const getUtmParams = () => {
  if (typeof window === "undefined") return {};
  const urlParams = new URLSearchParams(window.location.search);
  return {
    source: urlParams.get("utm_source") || undefined,
    medium: urlParams.get("utm_medium") || undefined,
    campaign: urlParams.get("utm_campaign") || undefined,
    term: urlParams.get("utm_term") || undefined,
    content: urlParams.get("utm_content") || undefined,
  };
};

export const getClientInfo = () => {
  if (typeof window === "undefined") return {
    userAgent: "SSR",
    language: "en",
    screenResolution: "0x0"
  };
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
  };
};

export const capturePageView = (path: string) => {
  trackEvent({
    data: {
      type: "page_view",
      path,
      utm: getUtmParams(),
      clientInfo: getClientInfo(),
    }
  }).catch(console.error);
};

export const captureClick = (path: string, elementText: string, elementId?: string, metadata?: any) => {
  trackEvent({
    data: {
      type: "click",
      path,
      elementId,
      elementText,
      metadata,
      utm: getUtmParams(),
      clientInfo: getClientInfo(),
    }
  }).catch(console.error);
};

export const captureFilter = (path: string, filterType: string, value: string) => {
  trackEvent({
    data: {
      type: "filter",
      path,
      metadata: { filterType, value },
      utm: getUtmParams(),
      clientInfo: getClientInfo(),
    }
  }).catch(console.error);
};
