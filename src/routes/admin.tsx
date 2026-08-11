import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    // In a real app, check session here
    // For now, allow entry but we'll add a simple login page later
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 p-6 space-y-8 bg-black/20">
        <div className="text-xl font-bold tracking-tighter">064 ADMIN</div>
        <nav className="flex flex-col gap-2 text-sm text-neutral-400 uppercase tracking-widest">
          <a href="/admin" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Dashboard</a>
          <a href="/admin/artistas" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Artistas</a>
          <a href="/admin/agenda" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Agenda</a>
          <a href="/admin/servicos" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Serviços</a>
          <a href="/admin/conteudo" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Conteúdo</a>
          <a href="/admin/solicitacoes" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Solicitações</a>
          <a href="/admin/configuracoes" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm mt-auto">Configurações</a>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {/* Placeholder for dynamic content */}
        <div className="max-w-6xl mx-auto space-y-12">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter uppercase">Dashboard</h1>
                    <p className="text-neutral-500 text-sm mt-2">Visão geral do mercado 064 Talents.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Shows Confirmados", value: "01", sub: "Próximos eventos" },
                    { label: "Pré-Reservas", value: "00", sub: "Aguardando confirmação" },
                    { label: "Novas Solicitações", value: "00", sub: "Pendentes de análise" },
                    { label: "Em Negociação", value: "00", sub: "Propostas enviadas" }
                ].map((stat, i) => (
                    <div key={i} className="p-8 border border-white/5 bg-neutral-900/50 rounded-sm hover:bg-neutral-900 transition">
                        <div className="text-neutral-500 text-[9px] uppercase tracking-widest mb-4 font-bold">{stat.label}</div>
                        <div className="text-5xl font-black tracking-tighter mb-2">{stat.value}</div>
                        <div className="text-[10px] text-neutral-600 uppercase tracking-widest">{stat.sub}</div>
                    </div>
                ))}
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold tracking-tighter uppercase border-b border-white/5 pb-4">Ações Rápidas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs font-bold uppercase tracking-widest transition text-left">Novo Artista</button>
                    <button className="p-4 border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs font-bold uppercase tracking-widest transition text-left">Editar Hero</button>
                    <button className="p-4 border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs font-bold uppercase tracking-widest transition text-left">Ver Solicitações</button>
                    <button className="p-4 border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs font-bold uppercase tracking-widest transition text-left">Configurar Site</button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
