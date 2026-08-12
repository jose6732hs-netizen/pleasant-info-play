import { Artist, ArtistVideo, ArtistGallery } from "@/lib/cms.functions";
import { Instagram, Youtube, Globe, Facebook, MessageSquare, Play, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ArtistProfileProps {
  artist: Artist;
  videos?: ArtistVideo[];
  gallery?: ArtistGallery[];
  isPreview?: boolean;
}

export function ArtistProfile({ artist, videos = [], gallery = [], isPreview = false }: ArtistProfileProps) {
  return (
    <div className={`w-full bg-black text-white min-h-screen ${isPreview ? 'h-full overflow-y-auto' : ''}`}>
      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex items-end justify-start overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={artist.hero_url || artist.photo_url || "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=2070"} 
            alt={artist.name}
            className="w-full h-full object-cover grayscale opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 pb-20 md:pb-32 relative z-10 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white/50 bg-white/5 px-4 py-2 border border-white/10 backdrop-blur-sm">
              {artist.genre} • {artist.city}, {artist.state}
            </span>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] drop-shadow-2xl">
              {artist.name}
            </h1>
          </div>
          
          <p className="text-lg md:text-xl font-medium tracking-tight text-neutral-400 max-w-2xl leading-relaxed">
            {artist.highlight_phrase || artist.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="bg-white text-black px-12 py-5 text-xs font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition shadow-2xl">
              {artist.booking_btn_text || "CONTRATAR ARTISTA"}
            </button>
            <button className="bg-transparent text-white border border-white/20 backdrop-blur-md px-12 py-5 text-xs font-black uppercase tracking-[0.2em] hover:bg-white/10 transition">
              SOLICITAR ORÇAMENTO
            </button>
          </div>
        </div>
      </section>

      {/* SOBRE O ARTISTA */}
      <section className="py-24 md:py-40 container mx-auto px-6 border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">O Talento</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight">
              {artist.hero_title || `SOBRE ${artist.name}`}
            </h3>
          </div>
          <div className="space-y-8">
            <p className="text-xl md:text-2xl font-light text-neutral-400 leading-relaxed italic">
              {artist.short_bio}
            </p>
            <div className="h-px w-20 bg-white/20" />
            <p className="text-neutral-500 leading-relaxed text-lg whitespace-pre-line">
              {artist.full_bio}
            </p>
          </div>
        </div>
      </section>

      {/* VÍDEO PRINCIPAL */}
      {videos.length > 0 && (
        <section className="py-24 md:py-40 container mx-auto px-6">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Performance</h2>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">EM CENA</h3>
            </div>
            
            <div className="aspect-video w-full bg-neutral-900 border border-white/10 relative group overflow-hidden">
               {/* This would be an iframe in a real app */}
               <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-20 h-20 text-white/20 group-hover:text-white group-hover:scale-110 transition-all" />
               </div>
               <img 
                 src={videos[0].thumbnail || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=2070"} 
                 className="w-full h-full object-cover opacity-50"
                 alt="Performance video"
               />
               <div className="absolute bottom-0 left-0 p-8">
                 <h4 className="text-2xl font-bold uppercase">{videos[0].title}</h4>
               </div>
            </div>
          </div>
        </section>
      )}

      {/* GALERIA */}
      {gallery.length > 0 && (
        <section className="py-24 md:py-40 border-y border-white/5">
          <div className="container mx-auto px-6 space-y-12">
            <div className="flex justify-between items-end">
               <div className="space-y-4">
                 <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Visual</h2>
                 <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">PORTFÓLIO</h3>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {gallery.map((item, i) => (
                <div key={i} className={`relative overflow-hidden group border border-white/5 ${i === 0 ? 'md:col-span-2 md:row-span-2 h-[600px]' : 'h-[300px]'}`}>
                  <img 
                    src={item.image_url} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                    alt={item.alt_text || ""} 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
                    <p className="text-[10px] font-bold uppercase tracking-widest">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* REDES SOCIAIS & BOOKING */}
      <section className="py-24 md:py-40 bg-neutral-950">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Conexão</h2>
                <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">REDES SOCIAIS</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                {artist.instagram && (
                  <a href={artist.instagram} className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-sm hover:bg-white hover:text-black transition group">
                    <Instagram className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Instagram</span>
                  </a>
                )}
                {artist.youtube && (
                  <a href={artist.youtube} className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-sm hover:bg-white hover:text-black transition">
                    <Youtube className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">YouTube</span>
                  </a>
                )}
                {artist.website && (
                  <a href={artist.website} className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-sm hover:bg-white hover:text-black transition">
                    <Globe className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Site Oficial</span>
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white p-12 md:p-16 text-black space-y-8 relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9]">
                  LEVE {artist.name} <br/> PARA O SEU EVENTO
                </h3>
                <p className="text-neutral-600 font-medium">
                  {artist.booking_call_text || "Entre em contato agora para consultar disponibilidade e orçamentos."}
                </p>
                <div className="pt-4 flex flex-col gap-4">
                  <button className="w-full bg-black text-white py-5 text-xs font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition">
                    {artist.booking_btn_text || "CONTRATAR AGORA"}
                  </button>
                  <p className="text-[9px] text-center font-bold uppercase tracking-widest text-neutral-400">
                    RESPOSTA EM ATÉ 24 HORAS
                  </p>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 opacity-5">
                <MessageSquare className="w-80 h-80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER PÁGINA */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">064 TALENTS © 2026</p>
      </footer>
    </div>
  );
}
