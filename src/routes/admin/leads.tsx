import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getRealAnalyticsEvents, clearRealAnalyticsEvents } from "@/lib/analytics/tracker.functions";
import { MousePointer2, MapPin, Clock, Globe, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

export const Route = createFileRoute("/admin/leads")({
  component: AdminLeads,
});

function AdminLeads() {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchPath, setSearchPath] = useState<string>("");
  const [filters, setFilters] = useState({
    country: "all",
    region: "all",
    city: "all"
  });

  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ["analytics-events"],
    queryFn: () => getRealAnalyticsEvents(),
    refetchInterval: 5000,
  });

  const filteredEvents = events?.filter((event: any) => {
    const matchesType = filterType === "all" || event.type === filterType;
    const matchesPath = event.path.toLowerCase().includes(searchPath.toLowerCase()) || 
                       (event.elementText?.toLowerCase().includes(searchPath.toLowerCase()));
    const matchesCountry = filters.country === "all" || event.location?.country === filters.country;
    const matchesRegion = filters.region === "all" || event.location?.region === filters.region;
    const matchesCity = filters.city === "all" || event.location?.city === filters.city;

    return matchesType && matchesPath && matchesCountry && matchesRegion && matchesCity;
  });

  const countries = Array.from(new Set(events?.map((e: any) => e.location?.country).filter(Boolean) || []));
  const regions = Array.from(new Set(events?.filter((e: any) => filters.country === "all" || e.location?.country === filters.country).map((e: any) => e.location?.region).filter(Boolean) || []));
  const cities = Array.from(new Set(events?.filter((e: any) => filters.region === "all" || e.location?.region === filters.region).map((e: any) => e.location?.city).filter(Boolean) || []));

  return (
    <div className="p-6 md:p-12 space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase">Leads & Tracking</h1>
          <p className="text-neutral-500 text-sm mt-2">Monitoramento de tráfego e comportamento em tempo real.</p>
        </div>
        <button 
          onClick={async () => {
            if (confirm("Deseja realmente limpar todos os logs?")) {
              await clearRealAnalyticsEvents();
              refetch();
            }
          }}
          className="w-full md:w-auto text-[10px] uppercase font-bold tracking-widest bg-red-950/20 text-red-500 border border-red-900/30 px-6 py-2 hover:bg-red-900/40 transition"
        >
          Limpar Logs
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* Mapa de Visitantes */}
        <div className="bg-neutral-900/30 border border-white/5 rounded-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Distribuição Geográfica</h3>
            <div className="text-[10px] text-neutral-500 uppercase tracking-tighter">
              {filteredEvents?.filter(e => e.location?.latitude).length || 0} LOCALIZAÇÕES RASTREADAS
            </div>
          </div>
          
          <div className="aspect-[21/9] w-full bg-black/40 border border-white/5 rounded-sm relative overflow-hidden flex items-center justify-center group">
            <div className="absolute inset-0 opacity-20 grayscale invert pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            
            {filteredEvents?.filter(e => e.location?.latitude).length === 0 ? (
              <div className="text-neutral-600 text-[10px] uppercase tracking-[0.2em] animate-pulse">
                Aguardando dados de geolocalização...
              </div>
            ) : (
              <div className="relative w-full h-full">
                {Array.from(new Map(
                  filteredEvents
                    ?.filter(e => e.location?.latitude !== undefined && e.location?.longitude !== undefined)
                    .map(e => [`${e.location!.latitude}-${e.location!.longitude}`, e])
                ).values()).map((event: any, idx) => (
                  <div 
                    key={idx}
                    className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2"
                    style={{ 
                      left: `${((event.location.longitude + 180) / 360) * 100}%`,
                      top: `${((90 - event.location.latitude) / 180) * 100}%`
                    }}
                  >
                    <div className="w-full h-full bg-blue-500 rounded-full animate-ping opacity-75 absolute"></div>
                    <div className="w-full h-full bg-white rounded-full border border-blue-500 relative z-10 group-hover:scale-150 transition-transform cursor-pointer">
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black border border-white/10 px-2 py-1 text-[8px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 uppercase tracking-widest">
                        {event.location.city}, {event.location.region_code || event.location.region}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="absolute bottom-4 right-4 text-[8px] text-neutral-600 uppercase tracking-widest">
              Dados aproximados • IP-API Engine
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-neutral-900/30 p-4 border border-white/5 rounded-sm">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <Filter className="w-4 h-4 text-neutral-500" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-black border border-white/10 text-xs uppercase tracking-widest p-2 rounded-sm focus:outline-none focus:border-white transition"
            >
              <option value="all">EVENTOS</option>
              <option value="page_view">PÁGINAS</option>
              <option value="click">CLIQUES</option>
              <option value="session_start">SESSÕES</option>
            </select>

            <select 
              value={filters.country}
              onChange={(e) => setFilters(f => ({ ...f, country: e.target.value, region: "all", city: "all" }))}
              className="bg-black border border-white/10 text-xs uppercase tracking-widest p-2 rounded-sm focus:outline-none focus:border-white transition"
            >
              <option value="all">PAÍS</option>
              {countries.map(c => <option key={c as string} value={c as string}>{c as string}</option>)}
            </select>

            <select 
              value={filters.region}
              onChange={(e) => setFilters(f => ({ ...f, region: e.target.value, city: "all" }))}
              className="bg-black border border-white/10 text-xs uppercase tracking-widest p-2 rounded-sm focus:outline-none focus:border-white transition"
            >
              <option value="all">ESTADO</option>
              {regions.map(r => <option key={r as string} value={r as string}>{r as string}</option>)}
            </select>

            <select 
              value={filters.city}
              onChange={(e) => setFilters(f => ({ ...f, city: e.target.value }))}
              className="bg-black border border-white/10 text-xs uppercase tracking-widest p-2 rounded-sm focus:outline-none focus:border-white transition"
            >
              <option value="all">CIDADE</option>
              {cities.map(c => <option key={c as string} value={c as string}>{c as string}</option>)}
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
          
          <div className="border border-white/5 bg-neutral-900/50 rounded-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[800px]">
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
                          <div className="flex items-center gap-1 font-bold text-white uppercase tracking-tighter">
                            <MapPin className="w-3 h-3 text-blue-500" />
                            <span>{event.location?.city || 'Desconhecida'}</span>
                            <span className="text-neutral-500 ml-1">/ {event.location?.region || 'Desconhecido'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-neutral-500">
                            <Globe className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{event.client_info?.userAgent?.split(' ')[0] || 'Browser'}</span>
                            <span className="mx-1">•</span>
                            <span>{event.location?.isp || 'Provider'}</span>
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
  );
}
