---
name: Full Admin Implementation
description: Plan to implement full administrative functionality including CRUD operations and dynamic content reflection on the frontend using Lovable Cloud.
type: feature
---
# Plan: Full Admin Implementation & Dynamic Content

Implement persistent storage and management for all system entities (Artists, Content, Bookings, Contracts) to ensure admin edits reflect on the live site.

## Proposed Changes

### 1. Database Schema (Lovable Cloud)
- **site_content**: Store hero and about section texts.
- **artists**: Store artist profiles (name, genre, city, photo_url, slug, etc.).
- **calendar_events**: Manage artist availability and confirmed shows.
- **booking_requests**: Track new hiring solicitations and their negotiation state.
- **contracts**: Store generated contract documents and payment status.

### 2. Admin Logic (`src/lib/*.functions.ts`)
- Update server functions to interact with the database using the injected Supabase client.
- Implement full CRUD handlers for each entity.

### 3. Admin UI Updates
- **Artists**: Add "Add Artist" and "Edit Artist" modals/forms.
- **Content**: Connect "Save Changes" button to the `updateSiteContent` server function.
- **Agenda**: Persist new events and status updates.
- **Requests**: Implement status transitions (Proposta Enviada -> Confirmada -> Contrato).

### 4. Frontend Integration
- Update `src/routes/index.tsx` and `src/routes/artistas/$slug.tsx` to fetch data from the live database instead of empty mocks.

## Technical Details
- Enable Lovable Cloud for persistent storage.
- Use `createServerFn` with `.middleware([requireSupabaseAuth])` for all admin write operations.
- Implement Zod validation for all data entry points.
- Use TanStack Query for cache invalidation after mutations to ensure immediate UI feedback.
