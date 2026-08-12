# Plan: Professional UTM & Event Tracking Engine

Implement a robust, production-grade tracking system for 064 TALENTS, replacing all mock analytics with real-time data capture and persistence.

## User Review Required

> [!IMPORTANT]
> - This implementation will use **Lovable Cloud (PostgreSQL)** for persistence.
> - A new `analytics_events` and `user_sessions` table will be created.
> - Dashboard metrics will reset to zero initially as they transition to real data.

## Proposed Changes

### Tracking Engine & Persistence
- **Database Schema**: Create `user_sessions` (to track visitors, device, UTMs) and `analytics_events` (to track specific actions) in Lovable Cloud.
- **Session Management**: Implement a persistent visitor identification system (using cookies/localStorage) that survives navigation and browser restarts.
- **UTM Capture**: Automatically parse and persist `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `ref`, and `click_id`.

### Event Capture
- **Automatic Tracking**:
  - `page_view`: Track every route change.
  - `session_start`: Track the initial entry.
- **Interaction Tracking**:
  - `artist_view`: Specific event for profile visits.
  - `whatsapp_click` / `form_submit`: Conversion events.
  - `video_play`: Media engagement.
- **Metadata**: Every event will include location (country/state/city), device info (browser, OS, resolution), and specific context (artist_id, campaign).

### Admin Dashboard Refactor
- **Real-time Feed**: Update the Leads page to pull from the live database.
- **Dynamic Metrics**: The main dashboard will calculate totals (Views, Clicks, Conversions) via server functions querying the actual event logs.
- **Data Cleanup**: Remove all hardcoded "1200", "540" values from the codebase.

## Technical Details
- **Frontend**: A global `useTracking` hook and a root-level event listener in `src/routes/__root.tsx`.
- **Backend**: `createServerFn` handlers in `src/lib/analytics/tracker.functions.ts` calling Supabase/Cloud via `events.server.ts`.
- **Privacy**: Implement IP masking (storing only hashes or partials for location lookup) to ensure LGPD compliance.
- **Indexes**: Create GIN/B-tree indexes on `event_type`, `timestamp`, and `session_id` for fast dashboard queries.
