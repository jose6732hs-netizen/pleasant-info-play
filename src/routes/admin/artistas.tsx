import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getActiveArtists } from "@/lib/cms.functions";
import { LayoutDashboard, Users, Calendar, Briefcase, FileText, Settings, Search, Plus, MousePointer2 } from "lucide-react";
import logoAsset from "@/assets/logo-completa.png.asset.json";

export const Route = createFileRoute("/admin/artistas")({
  component: AdminArtists,
});

function AdminArtists() {
  const { data: artists } = useSuspenseQuery({
    queryKey: ["active-artists"],
    queryFn: () => getActiveArtists(),
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row w-full">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 p-6 space-y-8 bg-black/20">
        <div className="flex justify-start mb-8">
          <img src={logoAsset.url} alt="064 ADMIN" className="h-8 w-auto object-contain grayscale brightness-200" />
        </div>
        <nav className="flex flex-col gap-2 text-sm text-neutral-400 uppercase tracking-widest">
          <Link to="/admin" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm flex items-center gap-3">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/admin/artistas" className="p-3 bg-white/10 text-white transition rounded-sm font-bold flex items-center gap-3">
            <Users className="w-4 h-4" /> Artistas
          </Link>
          <Link to="/admin/leads" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm flex items-center gap-3">
            <MousePointer2 className="w-4 h-4" /> Leads & Tracking
          </Link>
          <Link to="/admin/agenda" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm flex items-center gap-3">
            <Calendar className="w-4 h-4" /> Agenda
          </Link>
          <Link to="/admin/contratos" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm flex items-center gap-3">
            <Briefcase className="w-4 h-4" /> Contratos
          </Link>
          <Link to="/admin/solicitacoes" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm flex items-center gap-3">
            <FileText className="w-4 h-4" /> Solicitações
          </Link>
          <Link to="/admin/configuracoes" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm flex items-center gap-3 mt-auto">
            <Settings className="w-4 h-4" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-12">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase">Artistas</h1>
              <p className="text-neutral-500 text-sm mt-2">Gerencie o casting da 064 Talents.</p>
            </div>
            <button className="bg-white text-black px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition flex items-center gap-2">
              <Plus className="w-4 h-4" /> Adicionar Artista
            </button>
          </header>

          <div className="flex flex-col md:flex-row gap-4">
             <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input 
                  type="text" 
                  placeholder="Pesquisar artistas..." 
                  className="w-full bg-neutral-900/50 border border-white/5 p-4 pl-12 text-sm focus:outline-none focus:border-white/20 transition"
                />
             </div>
             <select className="bg-neutral-900/50 border border-white/5 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-white/20 transition">
                <option>Todos os Gêneros</option>
                <option>Eletrofunk</option>
                <option>House</option>
                <option>Techno</option>
             </select>
          </div>

          <div className="overflow-x-auto border border-white/5 bg-neutral-900/20">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-neutral-900/50 border-b border-white/5 uppercase text-[10px] tracking-widest text-neutral-500">
                  <th className="p-6 font-bold">Artista</th>
                  <th className="p-6 font-bold">Gênero</th>
                  <th className="p-6 font-bold">Localidade</th>
                  <th className="p-6 font-bold">Status</th>
                  <th className="p-6 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { name: "DJ Jiraya Uai", genre: "Eletrofunk", location: "Goiânia, GO", status: "Ativo" },
                  { name: "Wam Baster", genre: "Eletrofunk", location: "Goiânia, GO", status: "Ativo" },
                  { name: "DJ Netto", genre: "House / Eletrofunk", location: "Goiânia, GO", status: "Ativo" },
                  { name: "DJ Low", genre: "House / Tech House", location: "Goiânia, GO", status: "Ativo" },
                ].map((artist, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition group">
                    <td className="p-6 flex items-center gap-4">
                      <div className="w-12 h-12 bg-neutral-800 rounded-sm overflow-hidden border border-white/5">
                        <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center text-[10px] font-bold text-neutral-600">064</div>
                      </div>
                      <span className="font-bold uppercase tracking-tighter text-lg">{artist.name}</span>
                    </td>
                    <td className="p-6 text-neutral-500 text-xs font-bold uppercase tracking-widest">{artist.genre}</td>
                    <td className="p-6 text-neutral-500 text-xs font-bold uppercase tracking-widest">{artist.location}</td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest border border-green-500/20">
                        {artist.status}
                      </span>
                    </td>
                    <td className="p-6 text-right space-x-4">
                      <button className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition">Editar</button>
                      <button className="text-[10px] font-bold uppercase tracking-widest text-red-500/50 hover:text-red-500 transition">Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-neutral-600">
            <span>Mostrando 4 artistas</span>
            <div className="flex gap-2">
              <button className="p-2 border border-white/5 hover:bg-white/5 transition disabled:opacity-50" disabled>Anterior</button>
              <button className="p-2 border border-white/5 hover:bg-white/5 transition disabled:opacity-50" disabled>Próximo</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
