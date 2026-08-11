import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Schema for an event in the artist's calendar
export const CalendarEventSchema = z.object({
  id: z.string().optional(),
  artist_id: z.string(),
  start_time: z.string(), // ISO String
  end_time: z.string(),   // ISO String
  title: z.string(),
  city: z.string(),
  state: z.string(),
  location: z.string().optional(),
  contractor: z.string().optional(),
  status: z.enum(['DISPONÍVEL', 'PRÉ-RESERVA', 'CONFIRMADO', 'INDISPONÍVEL', 'CANCELADO']),
  notes: z.string().optional(),
  booking_id: z.string().optional()
});

export type CalendarEvent = z.infer<typeof CalendarEventSchema>;

// Mock data storage in memory (resets on server restart)
let mockEvents: CalendarEvent[] = [
  {
    id: "evt-1",
    artist_id: "1",
    start_time: new Date(2026, 8, 20, 20, 0).toISOString(),
    end_time: new Date(2026, 8, 20, 22, 0).toISOString(),
    title: "Show de Lançamento",
    city: "Goiânia",
    state: "GO",
    location: "Arena 064",
    status: "CONFIRMADO",
    contractor: "Eventos SA"
  }
];

export const getArtistCalendar = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({
    artist_id: z.string(),
    start_date: z.string().optional(),
    end_date: z.string().optional()
  }).parse(data))
  .handler(async ({ data }) => {
    // In a real app, query database with filters
    return mockEvents.filter(e => e.artist_id === data.artist_id);
  });

export const addCalendarEvent = createServerFn({ method: "POST" })
  .validator((data: unknown) => CalendarEventSchema.parse(data))
  .handler(async ({ data }) => {
    // CHECK CONFLIT
    const conflict = mockEvents.find(e => 
      e.artist_id === data.artist_id && 
      e.status === 'CONFIRMADO' &&
      ((data.start_time >= e.start_time && data.start_time < e.end_time) ||
       (data.end_time > e.start_time && data.end_time <= e.end_time))
    );

    if (conflict) {
      throw new Error(`ATENÇÃO: ESTE ARTISTA POSSUI UM COMPROMISSO NESTA DATA/HORÁRIO (${conflict.title} em ${conflict.city}).`);
    }

    const newEvent = { ...data, id: `evt-${Date.now()}` };
    mockEvents.push(newEvent);
    return { success: true, event: newEvent };
  });

export const updateCalendarEventStatus = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    id: z.string(),
    status: z.enum(['DISPONÍVEL', 'PRÉ-RESERVA', 'CONFIRMADO', 'INDISPONÍVEL', 'CANCELADO'])
  }).parse(data))
  .handler(async ({ data }) => {
    mockEvents = mockEvents.map(e => e.id === data.id ? { ...e, status: data.status } : e);
    return { success: true };
  });

export const checkAvailability = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({
    artist_id: z.string(),
    date: z.string() // ISO String (just the date part usually)
  }).parse(data))
  .handler(async ({ data }) => {
    const targetDate = new Date(data.date).toDateString();
    const event = mockEvents.find(e => 
      e.artist_id === data.artist_id && 
      new Date(e.start_time).toDateString() === targetDate
    );

    if (!event) return { status: 'DISPONÍVEL' };
    return { status: event.status, event_id: event.id };
  });
