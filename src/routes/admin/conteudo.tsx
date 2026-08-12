import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";

export const Route = createFileRoute("/admin/conteudo")({
  component: AdminContent,
});

function AdminContent() {
  return (
    <div className="p-6 md:p-12 space-y-12">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase">Conteúdo do Site</h1>
        <p className="text-neutral-500 text-sm mt-2">Personalize os textos e imagens da página principal.</p>
      </header>

      <form className="space-y-12 pb-24">
        {/* Hero Section */}
        <section className="space-y-6 p-6 md:p-8 border border-white/5 bg-neutral-900/30 rounded-sm">
          <h2 className="text-lg font-bold uppercase tracking-widest text-neutral-400 border-b border-white/5 pb-4">Seção Hero</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Título Principal</label>
              <input type="text" defaultValue="064 TALENTS" className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Subtítulo</label>
              <input type="text" defaultValue="Artist Booking & Entertainment" className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Manifesto / Descrição</label>
              <textarea rows={3} defaultValue="Representando talentos. Criando conexões." className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition resize-none"></textarea>
            </div>
          </div>
        </section>

         {/* About Section */}
         <section className="space-y-6 p-6 md:p-8 border border-white/5 bg-neutral-900/30 rounded-sm">
          <h2 className="text-lg font-bold uppercase tracking-widest text-neutral-400 border-b border-white/5 pb-4">Sobre a 064</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Título</label>
              <input type="text" defaultValue="MAIS DO QUE BOOKING. CONEXÕES QUE MOVIMENTAM O MERCADO." className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Conteúdo Texto</label>
              <textarea rows={5} defaultValue="A 064 TALENTS é uma empresa de Artist Booking & Entertainment criada em Goiás com o propósito de conectar talentos a grandes oportunidades." className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition resize-none"></textarea>
            </div>
          </div>
        </section>

        <div className="fixed bottom-6 right-6 md:right-12 z-50">
            <button className="bg-white text-black px-8 md:px-12 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 shadow-2xl transition flex items-center gap-2">
                <Save className="w-4 h-4" /> Salvar Alterações
            </button>
        </div>
      </form>
    </div>
  );
}
