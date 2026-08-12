import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getActiveArtists } from "@/lib/cms.functions";
import { getArtistCalendar } from "@/lib/booking.functions";
import { format, isAfter, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { captureClick } from "@/lib/analytics-client";

export const Route = createFileRoute("/artistas/$slug")({
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData({
        queryKey: ["active-artists"],
        queryFn: () => getActiveArtists(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["calendar-events", params.slug],
        queryFn: () => getArtistCalendar({ data: { artist_id: params.slug } }),
      }),
    ]);
  },
  component: ArtistDetail,
});

function ArtistDetail() {
  const { slug } = Route.useParams();
  const { data: artists } = useSuspenseQuery({
    queryKey: ["active-artists"],
    queryFn: () => getActiveArtists(),
  });

  const { data: events } = useSuspenseQuery({
    queryKey: ["calendar-events", slug],
    queryFn: () => getArtistCalendar({ data: { artist_id: slug } }),
  });

  const artist = artists?.find((a: any) => a.slug === slug || a.id === slug) as any;

  const upcomingEvents = events
    ?.filter(e => e.status === 'CONFIRMADO' && isAfter(parseISO(e.start_time), new Date()))
    .sort((a, b) => parseISO(a.start_time).getTime() - parseISO(b.start_time).getTime())
    .slice(0, 5);

  if (!artist) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Artista não encontrado</h1>
          <a href="/" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-white transition">Voltar para o início</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-white selection:text-black">
      {/* Dynamic Header */}
      <header className="fixed w-full p-6 flex justify-between items-center z-50 backdrop-blur-md bg-neutral-950/80 border-b border-white/5">
        <a href="/" className="text-2xl font-bold tracking-tighter">064 TALENTS</a>
        <button className="bg-white text-black px-6 py-2 rounded-full text-xs font-bold uppercase hover:bg-neutral-200 transition">
          Solicitar Contratação
        </button>
      </header>

      <main>
        {/* Artist Hero */}
        <section className="relative h-[70vh] flex items-end p-6 md:p-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={artist.cover_url || artist.photo_url || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop"} 
              alt={artist.name}
              className="w-full h-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>
          </div>
          
          <div className="relative z-10 space-y-4 max-w-4xl">
            <div className="text-xs uppercase tracking-[0.4em] text-neutral-400 font-bold">{artist.genre}</div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none uppercase">{artist.name}</h1>
            <p className="text-sm uppercase tracking-widest text-neutral-500">Booking Oficial 064 Talents • {artist.city}, {artist.state}</p>
          </div>
        </section>

        {/* Artist Bio */}
        <section className="py-24 px-6 md:px-20 grid md:grid-cols-3 gap-16">
          <div className="md:col-span-2 space-y-8">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-neutral-500 border-b border-white/5 pb-4">Biografia</h2>
            <div className="text-lg text-neutral-300 leading-relaxed whitespace-pre-wrap font-light">
              {artist.bio || "Descrição em breve..."}
            </div>
            {artist.professional_description && (
               <div className="text-neutral-500 text-sm leading-relaxed">
                 {artist.professional_description}
               </div>
            )}
          </div>
          
          <div className="space-y-12">
            {upcomingEvents && upcomingEvents.length > 0 && (
              <div className="space-y-6">
                 <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-neutral-500 border-b border-white/5 pb-4">Próximos Shows</h2>
                 <div className="space-y-4">
                   {upcomingEvents.map((event) => (
                     <div key={event.id} className="group border-l border-white/10 pl-4 py-1 hover:border-white transition">
                       <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                         {format(parseISO(event.start_time), "dd 'de' MMMM", { locale: ptBR })}
                       </div>
                       <div className="text-sm font-bold uppercase tracking-tight group-hover:text-white transition">{event.city}, {event.state}</div>
                       <div className="text-[9px] text-neutral-600 uppercase tracking-widest">{event.location}</div>
                     </div>
                   ))}
                 </div>
              </div>
            )}
            
            <div className="space-y-6">
               <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-neutral-500 border-b border-white/5 pb-4">Conecte-se</h2>
               <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest">
                 {artist.instagram && <a href={artist.instagram} className="hover:text-neutral-400 transition">Instagram</a>}
                 {artist.youtube && <a href={artist.youtube} className="hover:text-neutral-400 transition">YouTube</a>}
                 {artist.spotify && <a href={artist.spotify} className="hover:text-neutral-400 transition">Spotify</a>}
                 {artist.tiktok && <a href={artist.tiktok} className="hover:text-neutral-400 transition">TikTok</a>}
               </div>
            </div>

            <div className="p-8 border border-white/5 bg-neutral-900/50 rounded-sm space-y-6">
               <h3 className="text-xs font-bold uppercase tracking-widest">Interessado?</h3>
               <button 
                 onClick={() => captureClick(window.location.pathname, "Solicitar Data (Artist Profile)", "artist-request-btn", { artist: artist.name })}
                 className="w-full bg-white text-black py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition"
               >
                  Solicitar Data
               </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 bg-neutral-950 text-center">
         <p className="text-[10px] text-neutral-700 uppercase tracking-widest">© 2026 064 TALENTS. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
