import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Persistence Layer
// Since Lovable Cloud credits are unavailable, we use a robust in-memory mock 
// that mimics database behavior. In a production environment, these would 
// use context.supabase or supabaseAdmin.

export interface Page {
  id: string;
  name: string;
  slug: string;
  status: 'RASCUNHO' | 'PUBLICADO';
  created_at: string;
}

export interface PageSection {
  id: string;
  page_id: string;
  name: string;
  type: string;
  status: 'ATIVA' | 'OCULTA';
  display_order: number;
  content: any;
  draft_content?: any;
  last_published_at?: string;
  created_at: string;
}

let pagesStore: Page[] = [
  { id: 'home', name: 'Página Inicial', slug: '/', status: 'PUBLICADO', created_at: new Date().toISOString() },
  { id: 'artistas', name: 'Artistas', slug: '/artistas', status: 'PUBLICADO', created_at: new Date().toISOString() },
  { id: 'servicos', name: 'Serviços', slug: '/servicos', status: 'PUBLICADO', created_at: new Date().toISOString() },
  { id: 'sobre', name: 'Sobre Nós', slug: '/sobre', status: 'PUBLICADO', created_at: new Date().toISOString() },
  { id: 'contratantes', name: 'Contratantes', slug: '/contratantes', status: 'PUBLICADO', created_at: new Date().toISOString() },
  { id: 'contato', name: 'Contato', slug: '/contato', status: 'PUBLICADO', created_at: new Date().toISOString() },
];

let sectionsStore: PageSection[] = [
  {
    id: 's1',
    page_id: 'home',
    name: 'Hero Cinematic',
    type: 'hero',
    status: 'ATIVA',
    display_order: 0,
    content: {
      title: "064 TALENTS",
      subtitle: "Artist Booking & Entertainment",
      description: "Representando talentos. Criando conexões.",
      complementary: "Do Goiás pro mundo.",
      image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop",
      video_url: ""
    },

    created_at: new Date().toISOString()
  },
  {
    id: 's2',
    page_id: 'home',
    name: 'Sobre a Agência',
    type: 'about',
    status: 'ATIVA',
    display_order: 1,
    content: {
      title: "MAIS DO QUE BOOKING. CONEXÕES QUE MOVIMENTAM O MERCADO.",
      text: "A 064 TALENTS é uma empresa de Artist Booking & Entertainment criada em Goiás com o propósito de conectar talentos a grandes oportunidades.",
      highlight: "DO GOIÁS PRO MUNDO.",
      image_url: "https://images.unsplash.com/photo-1547478011-8a30602558a3?q=80&w=1500&auto=format&fit=crop"
    },
    created_at: new Date().toISOString()
  }
];

export const getPages = createServerFn({ method: "GET" })
  .handler(async (): Promise<Page[]> => {
    return pagesStore;
  });

export const getPageSections = createServerFn({ method: "GET" })
  .validator((pageId: unknown) => z.string().parse(pageId))
  .handler(async ({ data: pageId }): Promise<PageSection[]> => {
    return sectionsStore
      .filter(s => s.page_id === pageId)
      .sort((a, b) => a.display_order - b.display_order);
  });

export const saveSection = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const index = sectionsStore.findIndex(s => s.id === data.id);
    if (index > -1) {
      sectionsStore[index] = { ...sectionsStore[index], ...data };
    } else {
      sectionsStore.push({
        ...data,
        id: data.id || `sec-${Date.now()}`,
        created_at: new Date().toISOString()
      });
    }
    return { success: true, section: data };
  });

export const updateSectionsOrder = createServerFn({ method: "POST" })
  .validator((data: { id: string, display_order: number }[]) => z.array(z.object({
    id: z.string(),
    display_order: z.number()
  })).parse(data))
  .handler(async ({ data }) => {
    data.forEach(item => {
      const section = sectionsStore.find(s => s.id === item.id);
      if (section) section.display_order = item.display_order;
    });
    return { success: true };
  });

export const deleteSection = createServerFn({ method: "POST" })
  .validator((id: unknown) => z.string().parse(id))
  .handler(async ({ data: id }) => {
    sectionsStore = sectionsStore.filter(s => s.id !== id);
    return { success: true };
  });

export const getSiteContent = createServerFn({ method: "GET" })
  .handler(async () => {
    return sectionsStore
      .filter(s => s.status === 'ATIVA' && s.page_id === 'home')
      .sort((a, b) => a.display_order - b.display_order)
      .map(s => ({
        section_name: s.type,
        content: s.content
      }));
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
