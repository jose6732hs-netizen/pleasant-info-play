import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/solicitacoes")({
  component: AdminBookings,
});

function AdminBookings() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 p-6 space-y-8 bg-black/20">
        <div className="text-xl font-bold tracking-tighter">064 ADMIN</div>
        <nav className="flex flex-col gap-2 text-sm text-neutral-400 uppercase tracking-widest">
          <a href="/admin" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Dashboard</a>
          <a href="/admin/artistas" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Artistas</a>
          <a href="/admin/agenda" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Agenda</a>
          <a href="/admin/agenda" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Agenda</a>
          <a href="/admin/servicos" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Serviços</a>
          <a href="/admin/conteudo" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Conteúdo</a>
          <a href="/admin/solicitacoes" className="p-3 bg-white/10 text-white transition rounded-sm font-bold">Solicitações</a>
          <a href="/admin/configuracoes" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm mt-auto">Configurações</a>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-12">
          <header className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase">Solicitações</h1>
              <p className="text-neutral-500 text-sm mt-2">Pedidos de contratação e parcerias.</p>
            </div>
          </header>

          <div className="flex gap-4 mb-8">
            {['Todas', 'Novas', 'Em Análise', 'Confirmadas'].map((filter) => (
              <button key={filter} className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-white/5 hover:border-white/20 transition rounded-full">
                {filter}
              </button>
            ))}
          </div>

          <div className="text-center py-32 border border-dashed border-white/5 bg-neutral-900/20 rounded-sm">
            <p className="text-neutral-600 text-xs uppercase tracking-[0.2em]">Nenhuma solicitação encontrada no banco de dados.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
