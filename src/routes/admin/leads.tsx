import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getRealAnalyticsEvents, clearRealAnalyticsEvents, getRealSessions } from "@/lib/analytics/tracker.functions";
import { getAllArtists } from "@/lib/cms.functions";
import { 
  MousePointer2, 
  MapPin, 
  Clock, 
  Globe, 
  Filter, 
  Search, 
  X, 
  Calendar, 
  User, 
  Smartphone, 
  Monitor,
  ChevronRight,
  RefreshCcw,
  Tag,
  ShieldCheck
} from "lucide-react";
import { format, isWithinInterval, parseISO, startOfDay, endOfDay, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/leads")({
  component: AdminLeads,
});

function AdminLeads() {
  const [searchPath, setSearchPath] = useState<string>("");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: subDays(new Date(), 7),
    end: new Date()
  });

  const [filters, setFilters] = useState({
    country: "all",
    region: "all",
    city: "all",
    type: "all",
    artist_id: "all",
    source: "all",
    device: "all",
  });

  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ["analytics-events"],
    queryFn: () => getRealAnalyticsEvents(),
    refetchInterval: 5000,
  });

  const { data: artists } = useQuery({
    queryKey: ["all-artists"],
    queryFn: () => getAllArtists(),
  });

  const { data: sessions } = useQuery({
    queryKey: ["analytics-sessions"],
    queryFn: () => getRealSessions(),
    refetchInterval: 10000,
  });

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    return events.filter((event: any) => {
      const eventDate = parseISO(event.timestamp);
      const inDateRange = isWithinInterval(eventDate, { 
        start: startOfDay(dateRange.start), 
        end: endOfDay(dateRange.end) 
      });
      if (!inDateRange) return false;

      const matchesType = filters.type === "all" || event.type === filters.type;
      const matchesPath = event.path.toLowerCase().includes(searchPath.toLowerCase()) || 
                         (event.element_text?.toLowerCase().includes(searchPath.toLowerCase()));
      const matchesCountry = filters.country === "all" || event.location?.country === filters.country;
      const matchesRegion = filters.region === "all" || event.location?.region === filters.region;
      const matchesCity = filters.city === "all" || event.location?.city === filters.city;
      const matchesArtist = filters.artist_id === "all" || event.artist_id === filters.artist_id;
      const matchesSource = filters.source === "all" || event.utm?.source === filters.source;
      
      const ua = event.client_info?.userAgent || '';
      const deviceType = ua.includes('Mobile') ? 'mobile' : 'desktop';
      const matchesDevice = filters.device === "all" || deviceType === filters.device;

      return matchesType && matchesPath && matchesCountry && matchesRegion && matchesCity && matchesArtist && matchesSource && matchesDevice;
    });
  }, [events, filters, searchPath, dateRange]);

  const uniqueValues = useMemo(() => {
    if (!events) return { countries: [], regions: [], cities: [], types: [], sources: [] };
    return {
      countries: Array.from(new Set(events.map((e: any) => e.location?.country).filter(Boolean))),
      regions: Array.from(new Set(events.map((e: any) => e.location?.region).filter(Boolean))),
      cities: Array.from(new Set(events.map((e: any) => e.location?.city).filter(Boolean))),
      types: Array.from(new Set(events.map((e: any) => e.type))),
      sources: Array.from(new Set(events.map((e: any) => e.utm?.source).filter(Boolean))),
    };
  }, [events]);

  const selectedSession = useMemo(() => {
    if (!selectedSessionId || !sessions || !events) return null;
    const session = sessions.find((s: any) => s.session_id === selectedSessionId);
    if (!session) return null;
    const sessionEvents = events.filter((e: any) => e.session_id === selectedSessionId);
    return { ...session, events: sessionEvents };
  }, [selectedSessionId, sessions, events]);

  const removeFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: "all" }));
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== "all").length;

  return (
    <div className="p-4 md:p-12 space-y-6 md:space-y-8 min-h-screen bg-black overflow-x-hidden">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">
            Inteligência <span className="text-neutral-500">de Tráfego</span>
          </h1>
          <p className="text-neutral-500 text-[9px] uppercase tracking-[0.3em] font-bold mt-2 flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" /> Auditoria Real & Validação de Tracking
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => refetch()}
            className="p-3 border border-white/10 hover:bg-white/5 transition rounded-sm"
            title="Atualizar"
          >
            <RefreshCcw className="w-4 h-4 text-neutral-400" />
          </button>
          <button 
            onClick={async () => {
              if (confirm("Deseja realmente limpar todos os logs?")) {
                await clearRealAnalyticsEvents();
                refetch();
              }
            }}
            className="flex-1 md:flex-none text-[10px] uppercase font-bold tracking-widest bg-red-950/20 text-red-500 border border-red-900/30 px-6 py-3 hover:bg-red-900/40 transition"
          >
            Resetar Banco
          </button>
        </div>
      </header>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-neutral-900/50 border border-white/5 p-6 space-y-6 rounded-sm">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-white" />
                <h3 className="text-xs font-black uppercase tracking-widest">Filtros Avançados</h3>
              </div>
              {activeFilterCount > 0 && (
                <button 
                  onClick={() => setFilters({ country: "all", region: "all", city: "all", type: "all", artist_id: "all", source: "all", device: "all" })}
                  className="text-[10px] text-neutral-500 hover:text-white uppercase font-bold"
                >
                  Limpar
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] uppercase font-black text-neutral-500 tracking-widest">Período</label>
                <select 
                  className="w-full bg-black border border-white/10 p-2 text-[10px] uppercase font-bold focus:border-white transition"
                  onChange={(e) => {
                    const days = parseInt(e.target.value);
                    setDateRange({ start: subDays(new Date(), days), end: new Date() });
                  }}
                >
                  <option value="7">Últimos 7 dias</option>
                  <option value="1">Hoje</option>
                  <option value="30">Últimos 30 dias</option>
                  <option value="90">Últimos 90 dias</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase font-black text-neutral-500 tracking-widest">Artista</label>
                <select 
                  value={filters.artist_id}
                  onChange={(e) => setFilters(f => ({ ...f, artist_id: e.target.value }))}
                  className="w-full bg-black border border-white/10 p-2 text-[10px] uppercase font-bold focus:border-white transition"
                >
                  <option value="all">Todos os Artistas</option>
                  {artists?.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase font-black text-neutral-500 tracking-widest">Localização (Cidade)</label>
                <div className="relative">
                  <select 
                    value={filters.city}
                    onChange={(e) => setFilters(f => ({ ...f, city: e.target.value }))}
                    className="w-full bg-black border border-white/10 p-2 text-[10px] uppercase font-bold focus:border-white transition appearance-none"
                  >
                    <option value="all">Todas as Cidades</option>
                    {uniqueValues.cities.map(c => <option key={c as string} value={c as string}>{c as string}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase font-black text-neutral-500 tracking-widest">Origem de Tráfego</label>
                <select 
                  value={filters.source}
                  onChange={(e) => setFilters(f => ({ ...f, source: e.target.value }))}
                  className="w-full bg-black border border-white/10 p-2 text-[10px] uppercase font-bold focus:border-white transition"
                >
                  <option value="all">Todas as Fontes</option>
                  {uniqueValues.sources.map(s => <option key={s as string} value={s as string}>{s as string}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase font-black text-neutral-500 tracking-widest">Dispositivo</label>
                <div className="grid grid-cols-2 gap-2">
                   <button 
                    onClick={() => setFilters(f => ({ ...f, device: f.device === 'desktop' ? 'all' : 'desktop' }))}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 border text-[9px] font-black uppercase tracking-widest transition",
                      filters.device === 'desktop' ? "bg-white text-black border-white" : "bg-black text-neutral-500 border-white/10 hover:border-white/30"
                    )}
                   >
                     <Monitor className="w-3 h-3" /> Desktop
                   </button>
                   <button 
                    onClick={() => setFilters(f => ({ ...f, device: f.device === 'mobile' ? 'all' : 'mobile' }))}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 border text-[9px] font-black uppercase tracking-widest transition",
                      filters.device === 'mobile' ? "bg-white text-black border-white" : "bg-black text-neutral-500 border-white/10 hover:border-white/30"
                    )}
                   >
                     <Smartphone className="w-3 h-3" /> Mobile
                   </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/30 border border-white/5 p-6 rounded-sm space-y-4">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Quick Stats</h4>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <div className="text-2xl font-black tracking-tighter">{filteredEvents.length}</div>
                   <div className="text-[8px] font-black text-neutral-600 uppercase">Eventos</div>
                </div>
                <div>
                   <div className="text-2xl font-black tracking-tighter">
                     {new Set(filteredEvents.map(e => e.visitor_id)).size}
                   </div>
                   <div className="text-[8px] font-black text-neutral-600 uppercase">Visitantes</div>
                </div>
             </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filter Chips */}
          <div className="flex flex-wrap gap-2 min-h-[32px]">
            {Object.entries(filters).map(([key, value]) => {
              if (value === "all") return null;
              return (
                <div key={key} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                  <span className="text-[8px] font-black uppercase text-neutral-500 tracking-widest">{key}:</span>
                  <span className="text-[10px] font-bold text-white uppercase">{value}</span>
                  <button onClick={() => removeFilter(key as any)} className="hover:text-red-500 transition">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="BUSCAR EM PÁGINAS, ELEMENTOS OU TEXTOS..."
              value={searchPath}
              onChange={(e) => setSearchPath(e.target.value)}
              className="w-full bg-neutral-900/50 border border-white/10 p-4 pl-12 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-white transition-all rounded-sm"
            />
          </div>

          {/* Events Table */}
          <div className="border border-white/5 bg-neutral-900/20 rounded-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-white/5 bg-black/40 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-black">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Evento</th>
                  <th className="p-4">Ator / Sessão</th>
                  <th className="p-4">Ação / Local</th>
                  <th className="p-4 text-right">Geolocalização</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr><td colSpan={5} className="p-12 text-center text-neutral-500 uppercase tracking-widest text-[10px] animate-pulse">Cruzando dados...</td></tr>
                ) : filteredEvents.length === 0 ? (
                  <tr><td colSpan={5} className="p-12 text-center text-neutral-500 uppercase tracking-widest text-[10px]">Nenhum dado encontrado para os filtros selecionados.</td></tr>
                ) : (
                  filteredEvents.slice().reverse().map((event: any) => (
                    <tr 
                      key={event.id} 
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                      onClick={() => setSelectedSessionId(event.session_id)}
                    >
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-mono font-bold">{format(parseISO(event.timestamp), "HH:mm:ss")}</span>
                           <span className="text-[8px] text-neutral-600 font-bold uppercase">{format(parseISO(event.timestamp), "dd/MM/yy")}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-tighter",
                          event.type.includes('artist') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          event.type === 'page_view' ? 'bg-white/5 text-neutral-400 border border-white/10' :
                          'bg-green-500/10 text-green-400 border border-green-500/20'
                        )}>
                          {event.type.replace('artist_', '')}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                           <Link 
                             to="/admin/visitantes/$visitorId" 
                             params={{ visitorId: event.visitor_id }}
                             className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-blue-600 transition-colors flex items-center justify-center text-[10px] font-bold"
                           >
                             {event.visitor_id.substring(0, 2).toUpperCase()}
                           </Link>
                           <div className="flex flex-col">
                              <span className="text-[10px] font-mono text-neutral-400">ID: {event.session_id.substring(0, 8)}</span>
                              <span className="text-[8px] text-neutral-600 font-bold uppercase">{event.client_info?.userAgent?.split(' ')[0]}</span>
                           </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                           <div className="text-[10px] font-bold text-neutral-300 truncate max-w-[200px] uppercase tracking-tight">
                             {event.element_text || event.path}
                           </div>
                           {event.utm?.source && (
                             <div className="flex items-center gap-1 text-[8px] font-black text-blue-500 uppercase tracking-widest">
                               <Tag className="w-2 h-2" /> {event.utm.source} / {event.utm.medium || 'direct'}
                             </div>
                           )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex flex-col items-end">
                           <div className="text-[10px] font-black text-white uppercase tracking-tighter">{event.location?.city || 'Local incerto'}</div>
                           <div className="text-[8px] text-neutral-600 font-bold uppercase">{event.location?.region || 'Mundial'}</div>
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

      {/* Session Details Drawer/Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-[100] flex justify-end">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedSessionId(null)} />
           <div className="relative w-full max-w-2xl bg-neutral-950 border-l border-white/10 h-full flex flex-col animate-in slide-in-from-right duration-500">
              <header className="p-8 border-b border-white/5 flex items-center justify-between">
                 <div className="space-y-1">
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Detalhes da Sessão</h2>
                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Visitante: {selectedSession.visitor_id}</p>
                 </div>
                 <button onClick={() => setSelectedSessionId(null)} className="p-2 hover:bg-white/5 rounded-full transition">
                    <X className="w-6 h-6" />
                 </button>
              </header>

              <div className="flex-1 overflow-y-auto p-8 space-y-12">
                 {/* Metadata Grid */}
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                       <div className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">Localização</div>
                       <div className="flex items-center gap-2 text-xs font-bold uppercase">
                          <MapPin className="w-3 h-3 text-blue-500" /> {selectedSession.location?.city}, {selectedSession.location?.country}
                       </div>
                    </div>
                    <div className="space-y-1">
                       <div className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">Dispositivo</div>
                       <div className="flex items-center gap-2 text-xs font-bold uppercase">
                          <Monitor className="w-3 h-3 text-neutral-500" /> {selectedSession.device.browser}
                       </div>
                    </div>
                    <div className="space-y-1">
                       <div className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">Primeira Visita</div>
                       <div className="flex items-center gap-2 text-xs font-bold uppercase">
                          <Clock className="w-3 h-3 text-neutral-500" /> {format(parseISO(selectedSession.first_seen), "dd/MM/yy HH:mm")}
                       </div>
                    </div>
                 </div>

                 {/* UTM Tags */}
                 {selectedSession.utm && Object.values(selectedSession.utm).some(v => !!v) && (
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Parâmetros de Origem</h4>
                      <div className="flex flex-wrap gap-2">
                         {Object.entries(selectedSession.utm).map(([k, v]) => v && (
                           <div key={k} className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-[9px] font-bold uppercase text-blue-400 rounded-sm">
                             {k}: {v as string}
                           </div>
                         ))}
                      </div>
                   </div>
                 )}

                 {/* Timeline */}
                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Jornada do Usuário</h4>
                    <div className="relative space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/5">
                       {selectedSession.events.map((e: any, idx: number) => (
                         <div key={e.id} className="relative pl-10">
                            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center">
                               <div className={cn(
                                 "w-2 h-2 rounded-full",
                                 e.type === 'session_start' ? "bg-green-500" : 
                                 e.type.includes('artist') ? "bg-blue-500" : "bg-neutral-500"
                               )} />
                            </div>
                            <div className="space-y-1">
                               <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase tracking-tighter">{e.type.replace('_', ' ')}</span>
                                  <span className="text-[8px] font-mono text-neutral-600">{format(parseISO(e.timestamp), "HH:mm:ss")}</span>
                               </div>
                               <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight leading-relaxed">
                                 {e.element_text || e.path}
                               </div>
                               {e.metadata && Object.keys(e.metadata).length > 0 && (
                                 <div className="text-[8px] font-mono text-neutral-600 bg-black p-2 rounded-sm mt-2">
                                   {JSON.stringify(e.metadata)}
                                 </div>
                               )}
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
              
              <footer className="p-8 border-t border-white/5">
                 <button 
                  onClick={() => setSelectedSessionId(null)}
                  className="w-full bg-white text-black py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition"
                 >
                   Fechar Jornada
                 </button>
              </footer>
           </div>
        </div>
      )}
    </div>
  );
}
