# Visual Site Editor Improvements & Fixes

The user reported two main issues:
1. Missing options to add images or videos in the "Página Inicial" (Home Page) banner/hero.
2. The "edit pencil" icon doesn't open the editor.

## Proposed Changes

### 1. Fix Editor Navigation
- The user is likely trying to edit sections from the public home page using a "floating pencil" or similar, but the actual editor is located at `/admin/editor`.
- I will ensure the "edit" icons in the Admin Area (`/admin/editor/$pageId`) are correctly linked and functional.
- I will verify `src/routes/admin/editor/$pageId.tsx` to ensure the "Edit Content" button correctly navigates to the visual editor.

### 2. Enhance Hero & Banner Editing
- Update `src/routes/admin/editor/$pageId/edit/$sectionId.tsx` to explicitly handle `video_url` and `image_url` for the Hero section.
- Ensure the `VideoEditor` and `ImageEditor` components are correctly receiving and updating these fields.
- Add specific controls for "Banner" style settings (overlay, opacity, background type) to give more control over the "Site Oficial" look.

### 3. Improve Hero Section in CMS Mock
- Update `src/lib/cms.functions.ts` to include initial values for `video_url` and `image_url` in the default Home Hero section to ensure they appear in the editor.

## Technical Details

### CMS Logic (`src/lib/cms.functions.ts`)
- Modify `sectionsStore` initial data for `home` page `hero` to include placeholder media fields.

### Visual Editor (`src/routes/admin/editor/$pageId/edit/$sectionId.tsx`)
- Refine the filtering logic that decides which editor (Image/Video/Text) to show for each field.
- Ensure the `Accordion` for Media and Video detects fields like `video_url` and `image_url` correctly.

### Section Editor Components
- Verify `src/components/admin/ImageEditor.tsx` and `src/components/admin/VideoEditor.tsx` correctly call the `onChange` callback with the new data.

### Navigation
- Check `src/routes/admin/editor/$pageId.tsx` to ensure the `Link` to `/admin/editor/$pageId/edit/$sectionId` is correct and not blocked by any overlay or state issue.
