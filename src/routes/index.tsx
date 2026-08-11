import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, Instagram, Mail, Phone, Users, Calendar, Award, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
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
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none">
              064 TALENTS
            </h1>
            <p className="text-lg md:text-xl font-light uppercase tracking-[0.3em] text-neutral-300">
              Artist Booking & Entertainment
            </p>
            <p className="text-md font-bold uppercase tracking-widest pt-4">
              Representando talentos. Criando conexões.
            </p>
            <div className="flex gap-4 justify-center pt-8">
              <button className="border border-white/20 hover:bg-white hover:text-black px-8 py-3 rounded-full uppercase text-xs font-bold tracking-widest transition">
                Contrate um artista
              </button>
              <button className="bg-white text-black px-8 py-3 rounded-full uppercase text-xs font-bold tracking-widest hover:bg-neutral-200 transition">
                Conheça a 064
              </button>
            </div>
          </div>

          <div className="absolute bottom-10 animate-bounce">
            <ArrowDown className="w-6 h-6 text-white/50" />
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-neutral-900 border-y border-white/5">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "064", sub: "Goiás" },
              { label: "Booking", sub: "Oficial" },
              { label: "Artistas", sub: "Representados" },
              { label: "Brasil", sub: "Expansão" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-black tracking-tighter mb-2">{stat.label}</div>
                <div className="text-xs uppercase tracking-widest text-neutral-500">{stat.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="sobre" className="py-24 px-6 md:px-20 bg-neutral-950">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
                MAIS DO QUE BOOKING.<br />
                <span className="text-neutral-500">CONEXÕES QUE MOVIMENTAM O MERCADO.</span>
              </h2>
              <p className="text-neutral-400 leading-relaxed text-lg">
                A 064 TALENTS é uma empresa de Artist Booking & Entertainment criada em Goiás com o propósito de conectar talentos a grandes oportunidades.
              </p>
              <p className="text-2xl font-bold uppercase italic tracking-wider text-white">
                DO GOIÁS PRO MUNDO.
              </p>
            </div>
            <div className="aspect-[4/5] bg-neutral-800 rounded-sm overflow-hidden shadow-2xl">
               <img src="https://images.unsplash.com/photo-1547478011-8a30602558a3?q=80&w=1500&auto=format&fit=crop" alt="Stage" className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-700" />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="servicos" className="py-24 px-6 md:px-20 bg-neutral-900/30">
           <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-16 text-center">
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
                      <h3 className="font-bold tracking-tight mb-2 text-neutral-200">{service.title}</h3>
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
            <div className="text-2xl font-bold tracking-tighter mb-4">064 TALENTS</div>
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
