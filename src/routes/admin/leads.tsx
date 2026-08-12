import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAnalyticsEvents } from "@/lib/analytics.functions";
import { LayoutDashboard, Users, Calendar, Briefcase, FileText, Settings, MousePointer2, MapPin, Clock, Globe, Filter } from "lucide-react";
import logoAsset from "@/assets/logo-completa.png.asset.json";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

export const Route = createFileRoute("/admin/leads")({
  component: AdminLeads,
});

function AdminLeads() {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchPath, setSearchPath] = useState<string>("");

  const { data: events, isLoading } = useQuery({
    queryKey: ["analytics-events"],
    queryFn: () => getAnalyticsEvents(),
    refetchInterval: 5000,
  });

  const filteredEvents = events?.filter((event: any) => {
    const matchesType = filterType === "all" || event.type === filterType;
    const matchesPath = event.path.toLowerCase().includes(searchPath.toLowerCase()) || 
                       (event.elementText?.toLowerCase().includes(searchPath.toLowerCase()));
    return matchesType && matchesPath;
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
          <Link to="/admin/artistas" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm flex items-center gap-3">
            <Users className="w-4 h-4" /> Artistas
          </Link>
          <Link to="/admin/leads" className="p-3 bg-white/10 text-white transition rounded-sm font-bold flex items-center gap-3">
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
          <header className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase">Leads & Tracking</h1>
              <p className="text-neutral-500 text-sm mt-2">Monitoramento de tráfego e comportamento em tempo real.</p>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-neutral-900/30 p-4 border border-white/5 rounded-sm">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Filter className="w-4 h-4 text-neutral-500" />
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-black border border-white/10 text-xs uppercase tracking-widest p-2 rounded-sm focus:outline-none focus:border-white transition"
                >
                  <option value="all">Todos os Eventos</option>
                  <option value="page_view">Páginas Vistas</option>
                  <option value="click">Cliques</option>
                  <option value="filter">Filtros</option>
                  <option value="modal_open">Modais</option>
                </select>
              </div>
              <div className="w-full md:w-64">
                <input 
                  type="text" 
                  placeholder="BUSCAR CAMINHO OU TEXTO..."
                  value={searchPath}
                  onChange={(e) => setSearchPath(e.target.value)}
                  className="w-full bg-black border border-white/10 p-2 text-[10px] uppercase tracking-widest focus:outline-none focus:border-white transition"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tighter uppercase border-b border-white/5 pb-4">Eventos Recentes</h2>
              
              <div className="border border-white/5 bg-neutral-900/50 rounded-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/40 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                      <th className="p-4">Data/Hora</th>
                      <th className="p-4">Evento</th>
                      <th className="p-4">Origem (UTM)</th>
                      <th className="p-4">Página/Elemento</th>
                      <th className="p-4">Localização/Dispositivo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {isLoading ? (
                      <tr><td colSpan={5} className="p-8 text-center text-neutral-500">Carregando eventos...</td></tr>
                    ) : filteredEvents?.length === 0 ? (
                      <tr><td colSpan={5} className="p-8 text-center text-neutral-500">Nenhum evento corresponde aos filtros.</td></tr>
                    ) : (
                      filteredEvents?.slice().reverse().map((event: any) => (
                        <tr key={event.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-neutral-500" />
                              {format(new Date(event.timestamp), "HH:mm:ss", { locale: ptBR })}
                              <span className="text-neutral-600 text-[10px]">
                                {format(new Date(event.timestamp), "dd/MM", { locale: ptBR })}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                              event.type === 'page_view' ? 'bg-blue-500/20 text-blue-400' : 
                              event.type === 'click' ? 'bg-green-500/20 text-green-400' :
                              'bg-purple-500/20 text-purple-400'
                            }`}>
                              {event.type.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-4">
                            {event.utm?.source ? (
                              <div className="text-[10px] space-y-1">
                                <div className="text-white">Src: <span className="text-neutral-400">{event.utm.source}</span></div>
                                <div className="text-white">Med: <span className="text-neutral-400">{event.utm.medium || '-'}</span></div>
                              </div>
                            ) : (
                              <span className="text-neutral-600">Tráfego Direto</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="text-xs font-mono text-neutral-300 max-w-[200px] truncate">{event.path}</div>
                            {event.elementText && (
                              <div className="text-[10px] text-neutral-500 mt-1 italic">Click: "{event.elementText}"</div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1 text-[10px]">
                              <div className="flex items-center gap-1">
                                <Globe className="w-3 h-3 text-neutral-500" />
                                <span className="truncate max-w-[150px]">{event.clientInfo?.userAgent.split(' ')[0]}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-neutral-500" />
                                <span>{event.clientInfo?.screenResolution}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
