import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/artistas")({
  component: AdminArtists,
});

function AdminArtists() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 p-6 space-y-8 bg-black/20">
        <div className="text-xl font-bold tracking-tighter">064 ADMIN</div>
        <nav className="flex flex-col gap-2 text-sm text-neutral-400 uppercase tracking-widest">
          <a href="/admin" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Dashboard</a>
          <a href="/admin/artistas" className="p-3 bg-white/10 text-white transition rounded-sm font-bold">Artistas</a>
          <a href="/admin/agenda" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Agenda</a>
          <a href="/admin/agenda" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Agenda</a>
          <a href="/admin/servicos" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Serviços</a>
          <a href="/admin/conteudo" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Conteúdo</a>
          <a href="/admin/solicitacoes" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Solicitações</a>
          <a href="/admin/configuracoes" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm mt-auto">Configurações</a>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-12">
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase">Artistas</h1>
              <p className="text-neutral-500 text-sm mt-2">Gerencie o casting da 064 Talents.</p>
            </div>
            <button className="bg-white text-black px-6 py-2 rounded-full text-xs font-bold uppercase hover:bg-neutral-200 transition">
              Adicionar Artista
            </button>
          </header>

          <div className="overflow-x-auto border border-white/5">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-neutral-900/50 border-b border-white/5 uppercase text-[10px] tracking-widest text-neutral-500">
                  <th className="p-4 font-semibold">Artista</th>
                  <th className="p-4 font-semibold">Gênero</th>
                  <th className="p-4 font-semibold">Localidade</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="hover:bg-white/5 transition group">
                  <td className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-neutral-800 rounded-sm"></div>
                    <span className="font-bold uppercase tracking-tight">DJ Exemplo</span>
                  </td>
                  <td className="p-4 text-neutral-400">Eletrofunk</td>
                  <td className="p-4 text-neutral-400">Goiânia, GO</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full uppercase tracking-widest">Ativo</span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-white">Editar</button>
                    <button className="text-xs font-bold uppercase tracking-widest text-destructive hover:text-destructive/80">Excluir</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center p-12 border border-dashed border-white/5 text-neutral-600 text-xs uppercase tracking-[0.2em]">
            Fim da listagem
          </div>
        </div>
      </main>
    </div>
  );
}
