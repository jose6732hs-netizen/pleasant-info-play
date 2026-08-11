import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/configuracoes")({
  component: AdminSettings,
});

function AdminSettings() {
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
          <a href="/admin/configuracoes" className="p-3 bg-white/10 text-white transition rounded-sm font-bold mt-auto">Configurações</a>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-12">
          <header>
            <h1 className="text-4xl font-bold tracking-tighter uppercase">Configurações</h1>
            <p className="text-neutral-500 text-sm mt-2">Ajustes da conta e plataforma.</p>
          </header>

          <div className="space-y-8">
            <section className="p-8 border border-white/5 bg-neutral-900/30 rounded-sm space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Perfil do Administrador</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Nome de Exibição</label>
                        <input type="text" defaultValue="Administrador 064" className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">E-mail</label>
                        <input type="email" defaultValue="admin@064talents.com.br" className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition" />
                    </div>
                </div>
            </section>

            <section className="p-8 border border-white/5 bg-neutral-900/30 rounded-sm space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Segurança</h2>
                <button className="text-xs font-bold uppercase tracking-widest border border-white/10 px-6 py-3 rounded-full hover:bg-white/5 transition">
                    Alterar Senha
                </button>
            </section>
          </div>

          <div className="flex justify-end pt-8">
            <button className="bg-destructive text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-destructive/80 transition">
                Sair do Sistema
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
