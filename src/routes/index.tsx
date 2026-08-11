import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed w-full p-6 flex justify-between items-center z-50">
        <div className="text-2xl font-bold tracking-tighter">064 TALENTS</div>
        <nav className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          <a href="#" className="hover:text-white transition">Início</a>
          <a href="#" className="hover:text-white transition">Artistas</a>
          <a href="#" className="hover:text-white transition">Serviços</a>
          <a href="#" className="hover:text-white transition">Sobre</a>
          <a href="#" className="hover:text-white transition">Contato</a>
        </nav>
        <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold uppercase hover:bg-neutral-200 transition">
          Contrate um artista
        </button>
      </header>

      <main>
        <section className="relative h-screen flex flex-col items-center justify-center text-center px-4">
          <div className="absolute inset-0 bg-neutral-900/60 z-0"></div>
          <div className="relative z-10">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
              064 TALENTS
            </h1>
            <p className="text-xl md:text-2xl font-light uppercase tracking-[0.2em] mb-8">
              Artist Booking & Entertainment
            </p>
            <p className="text-lg font-bold uppercase tracking-widest mb-12">
              Representando talentos. Criando conexões.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="border border-white/20 hover:bg-white hover:text-black px-8 py-3 rounded-full uppercase text-sm font-bold transition">
                Contrate um artista
              </button>
              <button className="bg-white text-black px-8 py-3 rounded-full uppercase text-sm font-bold hover:bg-neutral-200 transition">
                Conheça a 064
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

