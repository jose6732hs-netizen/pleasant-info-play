---
name: Professional Artist Management System (064 TALENTS)
description: A complete system for artist registration, management, and professional presentation with dynamic individual pages and real-time admin preview.
type: feature
---

# Plan: Professional Artist Management System

Transform the artists' area into a robust booking and management system. This includes a comprehensive administrative panel for CRUD operations and premium, dynamically generated public profiles.

## Proposed Changes

### 1. Database Schema (Lovable Cloud)
- **Table: `artists`**
  - ID, Slug (unique), Status (Active/Inactive), Featured (Boolean), Display Order.
  - Basic Info: Artistic Name, Full Name, Main Category, Genre, Sub-genre.
  - Location: City, State, Country.
  - Texts: Hero title, Subtitle, Short Bio, Full Bio, History, Career Highlights.
  - Media: Main image (Hero), Thumbnail preview.
  - Social: Instagram, TikTok, YouTube, Spotify, Deezer, Facebook, Site.
  - Booking: Availability text, types of hiring, region, commercial notes.
  - SEO: Title, Description, OG Image.
- **Table: `artist_videos`**
  - ID, Artist ID (FK), Title, URL, Source (YouTube/Vimeo), Order, Status.
- **Table: `artist_gallery`**
  - ID, Artist ID (FK), Image URL, Title, Caption, Alt Text, Order.

### 2. Administrative Panel (`/admin/artistas`)
- **List View**: Refined table with photo previews, status toggles, and multi-filter (active, genre, recent).
- **Multi-Tab Form**: 8-step wizard for adding/editing artists.
  - Step 1: Info (Names, categories, slug).
  - Step 2: Images (High-end upload with preview).
  - Step 3: Texts (Full BIO and career history).
  - Step 4: Videos (Dynamic list of external URLs).
  - Step 5: Social Media.
  - Step 6: Booking (Commercial terms).
  - Step 7: SEO.
  - Step 8: Preview (Real-time cinematic rendering).

### 3. Public Professional Profiles (`/artistas/$slug`)
- **Cinematic Layout**: Large hero images, urban/luxury aesthetic.
- **Dynamic Content**: Auto-rendered sections for Bio, Video Highlight, Gallery (Masonry), and Social Links.
- **Conversion Focused**: "Contract Artist" CTA always visible, opening a pre-filled booking form.

### 4. Integration & Persistence
- Update `cms.functions.ts` to fetch real data from Supabase.
- Implement storage handling for artist images and gallery photos.

## Technical Details
- **Tech Stack**: TanStack Start, Supabase (Lovable Cloud), Tailwind v4.
- **Media**: Integrated with Lovable Storage.
- **Validation**: Zod for all form schemas.
- **State**: TanStack Query for caching and real-time UI updates.
