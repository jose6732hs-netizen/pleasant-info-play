import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Mock implementation since database integration is limited by credits
// In a real scenario, these would call Supabase/Lovable Cloud

export const getSiteContent = createServerFn({ method: "GET" })
  .handler(async () => {
    return [
      {
        section_name: "hero",
        content: {
          title: "064 TALENTS",
          subtitle: "Artist Booking & Entertainment",
          description: "Representando talentos. Criando conexões.",
          complementary: "Do Goiás pro mundo."
        }
      },
      {
        section_name: "about",
        content: {
          title: "MAIS DO QUE BOOKING. CONEXÕES QUE MOVIMENTAM O MERCADO.",
          text: "A 064 TALENTS é uma empresa de Artist Booking & Entertainment criada em Goiás com o propósito de conectar talentos a grandes oportunidades.",
          highlight: "DO GOIÁS PRO MUNDO."
        }
      }
    ];
  });

export interface Artist {
  id: string;
  slug: string;
  status: 'ATIVO' | 'INATIVO';
  featured: boolean;
  display_order: number;
  created_at: string;
  
  // Basic Info
  name: string;
  full_name?: string;
  main_category: string;
  genre: string;
  sub_genre?: string;
  city: string;
  state: string;
  country: string;
  
  // Media
  photo_url?: string;
  hero_url?: string;
  
  // Texts
  hero_title?: string;
  subtitle?: string;
  caption?: string;
  highlight_phrase?: string;
  short_bio?: string;
  full_bio?: string;
  professional_description?: string;
  history?: string;
  musical_style_info?: string;
  differentials?: string;
  career_moments?: string;
  experience?: string;
  
  // Social
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  spotify?: string;
  deezer?: string;
  facebook?: string;
  website?: string;
  
  // Booking
  booking_btn_text?: string;
  booking_call_text?: string;
  availability?: string;
  hiring_type?: string;
  service_region?: string;
  accepted_events?: string;
  commercial_notes?: string;
  
  // SEO
  seo_title?: string;
  seo_description?: string;
  og_image?: string;
  indexable: boolean;
}

export interface ArtistVideo {
  id: string;
  artist_id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  caption?: string;
  order: number;
  status: 'ATIVO' | 'INATIVO';
}

export interface ArtistGallery {
  id: string;
  artist_id: string;
  image_url: string;
  title?: string;
  caption?: string;
  alt_text?: string;
  order: number;
}

// In-memory mock store
let artistsStore: Artist[] = [];
let artistVideosStore: ArtistVideo[] = [];
let artistGalleryStore: ArtistGallery[] = [];

export const getActiveArtists = createServerFn({ method: "GET" })
  .handler(async (): Promise<Artist[]> => {
    return artistsStore.filter(a => a.status === 'ATIVO').sort((a, b) => a.display_order - b.display_order);
  });

export const getArtistBySlug = createServerFn({ method: "GET" })
  .validator((slug: unknown) => z.string().parse(slug))
  .handler(async ({ data: slug }): Promise<{ artist: Artist, videos: ArtistVideo[], gallery: ArtistGallery[] } | null> => {
    const artist = artistsStore.find(a => a.slug === slug);
    if (!artist) return null;
    
    const videos = artistVideosStore.filter(v => v.artist_id === artist.id && v.status === 'ATIVO').sort((a, b) => a.order - b.order);
    const gallery = artistGalleryStore.filter(g => g.artist_id === artist.id).sort((a, b) => a.order - b.order);
    
    return { artist, videos, gallery };
  });

// Admin functions to manage the store
export const getAllArtists = createServerFn({ method: "GET" })
  .handler(async (): Promise<Artist[]> => {
    return artistsStore;
  });

export const saveArtist = createServerFn({ method: "POST" })
  .validator((data: any) => data) // In real app use zod
  .handler(async ({ data }) => {
    const index = artistsStore.findIndex(a => a.id === data.id);
    if (index > -1) {
      artistsStore[index] = { ...artistsStore[index], ...data };
    } else {
      artistsStore.push({ 
        ...data, 
        id: data.id || `art-${Date.now()}`,
        created_at: new Date().toISOString()
      });
    }
    return { success: true, artist: data };
  });

export const deleteArtist = createServerFn({ method: "POST" })
  .validator((id: unknown) => z.string().parse(id))
  .handler(async ({ data: id }) => {
    artistsStore = artistsStore.filter(a => a.id !== id);
    artistVideosStore = artistVideosStore.filter(v => v.artist_id !== id);
    artistGalleryStore = artistGalleryStore.filter(g => g.artist_id !== id);
    return { success: true };
  });

export const submitBookingRequest = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    name: z.string(),
    company: z.string().optional(),
    whatsapp: z.string(),
    email: z.string().email(),
    city: z.string().optional(),
    state: z.string().optional(),
    event_date: z.string().optional(),
    event_time: z.string().optional(),
    event_type: z.string().optional(),
    artist_id: z.string().optional(),
    budget: z.string().optional(),
    message: z.string().optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    // In a real scenario, this would check the calendar
    console.log("Booking request received:", data);
    
    // We can import checkAvailability but since this is a server function calling another, 
    // we would usually call the internal logic directly.
    
    return { 
      success: true, 
      status: 'NOVA',
      message: "Solicitação recebida com sucesso. Nossa equipe analisará a disponibilidade."
    };
  });
