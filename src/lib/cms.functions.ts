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

export const getActiveArtists = createServerFn({ method: "GET" })
  .handler(async () => {
    return [
      {
        id: "1",
        name: "DJ Exemplo",
        genre: "Eletrofunk",
        city: "Goiânia",
        photo_url: "https://images.unsplash.com/photo-1547478011-8a30602558a3?q=80&w=1500&auto=format&fit=crop",
        status: "active",
        display_order: 1
      }
    ];
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
