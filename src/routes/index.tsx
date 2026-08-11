import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowDown, Instagram, Mail, Phone, Users, Calendar, Award, Star } from "lucide-react";
import { getSiteContent, getActiveArtists } from "@/lib/cms.functions";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData({
        queryKey: ["site-content"],
        queryFn: () => getSiteContent(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["active-artists"],
        queryFn: () => getActiveArtists(),
      }),
    ]);
  },
  component: Index,
});

function Index() {
  const { data: contentData } = useSuspenseQuery({
    queryKey: ["site-content"],
    queryFn: () => getSiteContent(),
  });

  const { data: artists } = useSuspenseQuery({
    queryKey: ["active-artists"],
    queryFn: () => getActiveArtists(),
  });

  const getContent = (section: string) => {
    return contentData?.find((c: any) => c.section_name === section)?.content || {};
  };

  const hero = getContent("hero");
  const about = getContent("about");

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-white selection:text-black">
      {/* Header */}
      <header className="fixed w-full p-6 flex justify-between items-center z-50 backdrop-blur-md bg-neutral-950/80 border-b border-white/5">
        <div className="text-2xl font-bold tracking-tighter">064 TALENTS</div>
        <nav className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-widest text-neutral-400">
          <a href="#inicio" className="hover:text-white transition">Início</a>
          <a href="#artistas" className="hover:text-white transition">Artistas</a>
          <a href="#servicos" className="hover:text-white transition">Serviços</a>
          <a href="#sobre" className="hover:text-white transition">Sobre</a>
          <a href="#contato" className="hover:text-white transition">Contato</a>
        </nav>
        <button className="bg-white text-black px-6 py-2 rounded-full text-xs font-bold uppercase hover:bg-neutral-200 transition">
          Contrate um artista
        </button>
      </header>

      <main>
        {/* Hero Section */}
        <section id="inicio" className="relative h-screen flex flex-col items-center justify-center text-center px-4">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop"
              alt="CROWD"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/20 to-neutral-950"></div>
          </div>
          
          <div className="relative z-10 space-y-6">
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none uppercase">
              {hero.title || "064 TALENTS"}
            </h1>
            <p className="text-lg md:text-xl font-light uppercase tracking-[0.3em] text-neutral-300">
              {hero.subtitle || "Artist Booking & Entertainment"}
            </p>
            <p className="text-md font-bold uppercase tracking-widest pt-4">
              {hero.description || "Representando talentos. Criando conexões."}
            </p>
            <div className="flex gap-4 justify-center pt-8">
              <button className="border border-white/20 hover:bg-white hover:text-black px-8 py-3 rounded-full uppercase text-xs font-bold tracking-widest transition">
                Contrate um artista
              </button>
              <button className="bg-white text-black px-8 py-3 rounded-full uppercase text-xs font-bold tracking-widest hover:bg-neutral-200 transition">
                Conheça a 064
              </button>
            </div>
            {hero.complementary && (
              <p className="text-xs uppercase tracking-[0.4em] text-neutral-500 pt-8 opacity-50">
                {hero.complementary}
              </p>
            )}
          </div>

          <div className="absolute bottom-10 animate-bounce">
            <ArrowDown className="w-6 h-6 text-white/50" />
          </div>
        </section>

        {/* Artists Section */}
        <section id="artistas" className="py-24 px-6 md:px-20 bg-neutral-950">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Talentos</h2>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Conheça o casting oficial 064 Talents.</p>
            </div>

            {artists?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {artists.map((artist: any) => (
                  <div key={artist.id} className="group relative aspect-[3/4] overflow-hidden bg-neutral-900 rounded-sm">
                    <img 
                      src={artist.photo_url || "https://images.unsplash.com/photo-1547478011-8a30602558a3?q=80&w=1500&auto=format&fit=crop"} 
                      alt={artist.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                    <div className="absolute bottom-0 left-0 p-8 w-full space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">{artist.genre}</div>
                      <h3 className="text-3xl font-black tracking-tighter uppercase">{artist.name}</h3>
                      <div className="flex gap-4 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <button className="bg-white text-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-neutral-200">
                          Ver Artista
                        </button>
                        <button className="border border-white/20 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-black">
                          Solicitar Data
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 border border-dashed border-white/5 rounded-sm">
                <p className="text-neutral-600 text-xs uppercase tracking-widest">Nenhum artista cadastrado no momento.</p>
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section id="sobre" className="py-24 px-6 md:px-20 bg-neutral-900/30">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight uppercase">
                {about.title || "MAIS DO QUE BOOKING."}
              </h2>
              <p className="text-neutral-400 leading-relaxed text-lg">
                {about.text || "A 064 TALENTS é uma empresa de Artist Booking & Entertainment..."}
              </p>
              <p className="text-2xl font-bold uppercase italic tracking-wider text-white">
                {about.highlight || "DO GOIÁS PRO MUNDO."}
              </p>
            </div>
            <div className="aspect-[4/5] bg-neutral-800 rounded-sm overflow-hidden shadow-2xl">
               <img src="https://images.unsplash.com/photo-1547478011-8a30602558a3?q=80&w=1500&auto=format&fit=crop" alt="Stage" className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-700" />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="servicos" className="py-24 px-6 md:px-20 bg-neutral-950">
           <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-16 text-center uppercase">
                O TALENTO É DO ARTISTA.<br />
                <span className="text-neutral-600">A CONEXÃO É NOSSA.</span>
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                 {[
                   { title: "Booking Artístico", icon: Calendar },
                   { title: "Representação", icon: Users },
                   { title: "Gestão", icon: Award },
                   { title: "Negociação", icon: Star },
                   { title: "Produção", icon: Users },
                   { title: "Curadoria", icon: Star },
                   { title: "Eventos", icon: Calendar },
                   { title: "Parcerias", icon: Award }
                 ].map((service, i) => (
                   <div key={i} className="p-8 border border-white/5 bg-neutral-900/50 hover:bg-neutral-800/50 transition cursor-default">
                      <service.icon className="w-8 h-8 text-white mb-6 opacity-50" />
                      <h3 className="font-bold tracking-tight mb-2 text-neutral-200 uppercase">{service.title}</h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Intermediação profissional entre artista e contratante, garantindo segurança e resultados.
                      </p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/5 bg-neutral-950 text-center">
            <div className="text-2xl font-bold tracking-tighter mb-4 uppercase">064 TALENTS</div>
            <p className="text-xs text-neutral-600 uppercase tracking-widest mb-8">Representando talentos. Criando conexões. Do Goiás pro mundo.</p>
            <div className="flex justify-center gap-6 mb-8">
                <a href="#" className="text-neutral-500 hover:text-white transition"><Instagram /></a>
                <a href="#" className="text-neutral-500 hover:text-white transition"><Mail /></a>
                <a href="#" className="text-neutral-500 hover:text-white transition"><Phone /></a>
            </div>
            <p className="text-[10px] text-neutral-700 uppercase tracking-widest">© 2026 064 TALENTS. Todos os direitos reservados.</p>
        </footer>
      </main>
    </div>
  );
}
