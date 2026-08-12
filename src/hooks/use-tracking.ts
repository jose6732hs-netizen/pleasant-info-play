import { useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';
import { capturePageView, trackEvent } from '@/lib/analytics-client';

export const useTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Page view tracking
    capturePageView(location.pathname);

    // Initial session tracking
    if (!sessionStorage.getItem('064_session_tracked')) {
      trackEvent('landing_view', {
        referrer: document.referrer,
      });
      sessionStorage.setItem('064_session_tracked', 'true');
    }
  }, [location.pathname]);

  const trackAction = (type: string, metadata: any = {}) => {
    trackEvent(type, metadata);
  };

  return { trackAction };
};
