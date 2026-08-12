# Visual Site Editor Implementation Plan

This plan outlines the creation of a professional-grade Visual Site Editor for the 064 TALENTS administrative panel, allowing managed editing of pages and sections with persistence and a live preview.

## Proposed Changes

### 1. Data Modeling & Persistence
*   Update `src/lib/cms.functions.ts` to include interfaces and server functions for `Page` and `PageSection`.
*   Implement CRUD operations for sections: Edit, Duplicate, Hide, Reorder, Delete.
*   Support "Draft" vs "Published" states for content changes.

### 2. Admin Interface
*   **Editor Dashboard**: Create `src/routes/admin/editor/index.tsx` to list all editable site pages (Homepage, Artists, Services, etc.).
*   **Page Editor**: Create `src/routes/admin/editor/$pageId.tsx` to manage sections within a specific page.
    *   Implement Drag & Drop reordering using `@dnd-kit/core`.
    *   Show section previews and status toggles.
*   **Visual Editor (Canvas)**: Create `src/routes/admin/editor/$pageId/edit/$sectionId.tsx`.
    *   Implement a 3-panel layout: Properties (Left), Canvas/Preview (Center), Quick Options (Right).
    *   Device Emulation: Toggle between Desktop, Tablet, and Mobile views.
    *   State feedback: Loading, Saving, Saved, Error indicators.

### 3. Components
*   `AdminSidebar`: Update to include the new "Editor do Site" menu item.
*   `SectionEditorItem`: A component for individual section blocks in the reorderable list.
*   `VisualEditorLayout`: Shared layout for the visual editing experience.
*   `DeviceEmulator`: Wrapper for the site preview to handle responsive breakpoints.

### 4. Integration
*   Refactor `src/routes/index.tsx` (and other pages later) to fetch and render dynamic sections from the database instead of static components where applicable.

## Technical Details
*   **Drag & Drop**: Use `@dnd-kit` for a modern, accessible reordering experience.
*   **Styling**: Maintain the "Premium Dark" aesthetic with Tailwind CSS, using consistent padding and border-white/5 for separators.
*   **Iframe/Preview**: The visual editor will use a component-based preview that mimics the real site, allowing for safe isolation and responsive testing.
*   **Database**: Utilize Lovable Cloud (Supabase) via `src/lib/cms.functions.ts`.

## Rules to Follow
*   Do not break existing site functionality.
*   Ensure all edits are validated before saving.
*   Maintain the cinematic identity of 064 TALENTS.
