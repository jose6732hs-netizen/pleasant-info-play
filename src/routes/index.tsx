// src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Header */}
      <header className="fixed w-full p-6 flex justify-between items-center z-50 backdrop-blur-sm bg-black/50 border-b border-white/10">
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
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black"></div>
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

        {/* About Section */}
        <section id="sobre" className="py-24 px-6 md:px-20 bg-neutral-950">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
                MAIS DO QUE BOOKING.<br />
                <span className="text-neutral-500">CONEXÕES QUE MOVIMENTAM O MERCADO.</span>
              </h2>
              <p className="text-neutral-400 leading-relaxed">
                A 064 TALENTS é uma empresa de Artist Booking & Entertainment criada em Goiás com o propósito de conectar talentos a grandes oportunidades.
              </p>
              <p className="text-2xl font-bold uppercase italic tracking-wider text-white">
                DO GOIÁS PRO MUNDO.
              </p>
            </div>
            <div className="aspect-square bg-neutral-800 rounded-lg overflow-hidden">
               <img src="https://images.unsplash.com/photo-1547478011-8a30602558a3?q=80&w=1500&auto=format&fit=crop" alt="Stage" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
