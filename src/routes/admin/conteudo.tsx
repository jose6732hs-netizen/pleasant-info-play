import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/conteudo")({
  component: AdminContent,
});

function AdminContent() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 p-6 space-y-8 bg-black/20">
        <div className="text-xl font-bold tracking-tighter">064 ADMIN</div>
        <nav className="flex flex-col gap-2 text-sm text-neutral-400 uppercase tracking-widest">
          <a href="/admin" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Dashboard</a>
          <a href="/admin/artistas" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Artistas</a>
          <a href="/admin/agenda" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Agenda</a>
          <a href="/admin/contratos" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Contratos</a>
          <a href="/admin/servicos" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Serviços</a>
          <a href="/admin/conteudo" className="p-3 bg-white/10 text-white transition rounded-sm font-bold">Conteúdo</a>
          <a href="/admin/solicitacoes" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Solicitações</a>
          <a href="/admin/configuracoes" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm mt-auto">Configurações</a>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-12">
          <header>
            <h1 className="text-4xl font-bold tracking-tighter uppercase">Conteúdo do Site</h1>
            <p className="text-neutral-500 text-sm mt-2">Personalize os textos e imagens da página principal.</p>
          </header>

          <form className="space-y-12">
            {/* Hero Section */}
            <section className="space-y-6 p-8 border border-white/5 bg-neutral-900/30 rounded-sm">
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
             <section className="space-y-6 p-8 border border-white/5 bg-neutral-900/30 rounded-sm">
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

            <div className="sticky bottom-6 flex justify-end">
                <button className="bg-white text-black px-12 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-2xl hover:bg-neutral-200 transition">
                    Salvar Alterações
                </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
