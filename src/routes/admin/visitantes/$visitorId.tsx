import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getRealAnalyticsEvents, getRealSessions } from "@/lib/analytics/tracker.functions";
import { getAllArtists } from "@/lib/cms.functions";
import { 
  User, 
  MapPin, 
  Clock, 
  Monitor, 
  Globe, 
  ArrowLeft,
  ChevronRight,
  Heart,
  ThumbsUp,
  Flame,
  Star,
  Play,
  MousePointer2,
  Calendar,
  MessageSquare,
  FileText,
  Video,
  ExternalLink
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/visitantes/$visitorId")({
  component: VisitorView,
});

function VisitorView() {
  const { visitorId } = Route.useParams();
  
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["analytics-events"],
    queryFn: () => getRealAnalyticsEvents(),
    refetchInterval: 10000,
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["analytics-sessions"],
    queryFn: () => getRealSessions(),
    refetchInterval: 10000,
  });

  const { data: artists } = useQuery({
    queryKey: ["all-artists"],
    queryFn: () => getAllArtists(),
  });

  const visitorSessions = useMemo(() => {
    if (!sessions) return [];
    return sessions.filter(s => s.visitor_id === visitorId)
      .sort((a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime());
  }, [sessions, visitorId]);

  const visitorEvents = useMemo(() => {
    if (!events) return [];
    return events.filter(e => e.visitor_id === visitorId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [events, visitorId]);

  const mainSession = visitorSessions[0];

  const artistStats = useMemo(() => {
    if (!visitorEvents || !artists) return [];
    const stats: Record<string, { name: string; views: number; clicks: number; reactions: string[] }> = {};
    
    visitorEvents.forEach(e => {
      if (!e.artist_id) return;
      const artist = artists.find(a => a.id === e.artist_id);
      if (!artist) return;
      
      if (!stats[e.artist_id]) {
        stats[e.artist_id] = { name: artist.name, views: 0, clicks: 0, reactions: [] };
      }
      
      if (e.type === 'artist_view') stats[e.artist_id].views++;
      if (e.type === 'artist_click' || e.type.includes('click')) stats[e.artist_id].clicks++;
      if (e.type === 'artist_reaction') {
        const emoji = e.metadata?.reaction || '❤️';
        stats[e.artist_id].reactions.push(emoji);
      }
    });
    
    return Object.values(stats);
  }, [visitorEvents, artists]);

  const clickedButtons = useMemo(() => {
    return visitorEvents.filter(e => e.type.includes('click') || e.type.includes('whatsapp') || e.type.includes('budget'))
      .map(e => e.element_text || e.type.replace(/_/g, ' '))
      .filter((v, i, a) => a.indexOf(v) === i);
  }, [visitorEvents]);

  const reactions = useMemo(() => {
    return visitorEvents.filter(e => e.type === 'artist_reaction' || e.type === 'reaction')
      .map(e => e.metadata?.reaction || '❤️');
  }, [visitorEvents]);

  if (eventsLoading || sessionsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-12">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse text-white/50">
          Reconstituindo Jornada...
        </div>
      </div>
    );
  }

  if (!mainSession && visitorEvents.length === 0) {
    return (
      <div className="min-h-screen bg-black p-12 space-y-8">
        <Link to="/admin/leads" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Voltar para Leads
        </Link>
        <div className="text-center py-24 border border-white/5 bg-neutral-900/20">
           <h1 className="text-2xl font-black uppercase tracking-tighter">Visitante não encontrado</h1>
           <p className="text-neutral-500 text-[10px] uppercase tracking-widest mt-2">ID: {visitorId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <Link to="/admin/leads" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition mb-4">
            <ArrowLeft className="w-3 h-3" /> Voltar para Leads
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-xl font-black border border-white/10">
              {visitorId.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">Perfil do Visitante</h1>
              <p className="text-neutral-500 text-[9px] uppercase tracking-[0.3em] font-bold mt-1">ID Anonimizado: {visitorId}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-neutral-900/50 border border-white/5 px-6 py-4 rounded-sm flex flex-col items-center">
             <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest mb-1">Ações Totais</span>
             <span className="text-2xl font-black tracking-tighter">{visitorEvents.length}</span>
          </div>
          <div className="bg-neutral-900/50 border border-white/5 px-6 py-4 rounded-sm flex flex-col items-center">
             <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest mb-1">Sessões</span>
             <span className="text-2xl font-black tracking-tighter">{visitorSessions.length}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visitor Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-neutral-900/50 border border-white/10 p-8 rounded-sm space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <User className="w-24 h-24" />
            </div>
            
            <div className="space-y-6 relative z-10">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/50 border-b border-white/5 pb-4">Identificação & Local</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                  <div>
                    <div className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1">Localização Aproximada</div>
                    <div className="text-lg font-black uppercase tracking-tight">{mainSession.location?.city || 'Cidade Desconhecida'}</div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase">{mainSession.location?.region || 'Região'}, {mainSession.location?.country || 'País'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-neutral-500 shrink-0 mt-1" />
                  <div>
                    <div className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1">Cronologia</div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-[9px] font-bold text-neutral-400 uppercase">Primeira Visita</div>
                        <div className="text-xs font-bold uppercase">{mainSession ? format(parseISO(mainSession.first_seen), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : '-'}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-neutral-400 uppercase">Última Atividade</div>
                        <div className="text-xs font-bold uppercase">{mainSession ? format(parseISO(mainSession.last_activity), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : '-'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Globe className="w-5 h-5 text-neutral-500 shrink-0 mt-1" />
                  <div>
                    <div className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1">Origem (UTM)</div>
                    <div className="text-xs font-bold uppercase tracking-tight text-blue-400">
                      {mainSession?.utm?.source || 'Direto'} / {mainSession?.utm?.medium || 'N/A'}
                    </div>
                    {mainSession?.utm?.campaign && (
                      <div className="text-[9px] font-bold text-neutral-500 uppercase mt-1">Campanha: {mainSession.utm.campaign}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Monitor className="w-5 h-5 text-neutral-500 shrink-0 mt-1" />
                  <div>
                    <div className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1">Dispositivo</div>
                    <div className="text-xs font-bold uppercase truncate max-w-[200px]">
                      {mainSession?.device?.browser?.includes('Mobile') ? 'Mobile' : 'Desktop'}
                    </div>
                    <div className="text-[8px] font-mono text-neutral-600 truncate max-w-[200px] mt-1">{mainSession?.device?.browser}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons and Reactions Summary */}
          <div className="bg-neutral-900/30 border border-white/5 p-8 rounded-sm space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/50">Botões Clicados</h3>
              <div className="flex flex-wrap gap-2">
                {clickedButtons.length > 0 ? clickedButtons.map((btn, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-sm text-[9px] font-black uppercase tracking-widest text-white">
                    {btn}
                  </span>
                )) : (
                  <span className="text-[9px] uppercase text-neutral-600 italic">Nenhum botão clicado</span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/50">Reações Registradas</h3>
              <div className="flex flex-wrap gap-3">
                {reactions.length > 0 ? reactions.map((r, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                    {r}
                  </div>
                )) : (
                  <span className="text-[9px] uppercase text-neutral-600 italic">Nenhuma reação</span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border border-white/5 rounded-sm bg-blue-950/10">
            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2 flex items-center gap-2">
              <Globe className="w-3 h-3" /> Privacidade & Segurança
            </h4>
            <p className="text-[10px] text-neutral-500 leading-relaxed italic">
              Este dashboard utiliza IDs anonimizados e não exibe PII (Personal Identifiable Information). Os dados são coletados exclusivamente para fins de inteligência comercial e análise de performance.
            </p>
          </div>
        </div>

        {/* Main Content: Journey & Artists */}
        <div className="lg:col-span-2 space-y-12">
          {/* Timeline / Journey */}
          <div className="bg-neutral-900/40 border border-white/5 p-8 rounded-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-12 flex items-center gap-2">
               <ChevronRight className="w-4 h-4 text-white" /> Jornada Detalhada
            </h3>
            
            <div className="relative space-y-12 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
              {visitorEvents.slice(0, 50).map((e: any) => (
                <div key={e.id} className="relative pl-10 group">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-black border border-white/20 flex items-center justify-center z-10 group-hover:border-white transition-colors">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      e.type === 'session_start' ? "bg-green-500" : 
                      e.type.includes('artist') ? "bg-blue-500" : 
                      e.type.includes('click') ? "bg-yellow-500" : "bg-neutral-500"
                    )} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-white">
                          {e.type.replace(/_/g, ' ')}
                        </span>
                        {e.type.includes('click') && <MousePointer2 className="w-2 h-2 text-yellow-500" />}
                        {e.type.includes('video') && <Video className="w-2 h-2 text-red-500" />}
                      </div>
                      <span className="text-[9px] font-mono text-neutral-500 group-hover:text-white transition-colors">
                        {format(parseISO(e.timestamp), "HH:mm:ss")}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight leading-relaxed">
                      {e.element_text || e.path}
                    </div>
                    {e.artist_id && (
                      <div className="text-[8px] font-black text-blue-500 uppercase tracking-widest mt-1">
                        Ref: {artists?.find(a => a.id === e.artist_id)?.name || e.artist_id}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {visitorEvents.length > 50 && (
                <div className="text-[9px] text-neutral-600 uppercase font-black tracking-widest text-center py-4">
                  + {visitorEvents.length - 50} eventos anteriores
                </div>
              )}
            </div>
          </div>

          {/* Artist Interactions */}
          <div className="bg-neutral-900/40 border border-white/5 p-8 rounded-sm">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8">Artistas Visualizados</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {artistStats.length > 0 ? artistStats.map((stat, i) => (
                  <div key={i} className="bg-black/50 border border-white/5 p-6 rounded-sm space-y-4 hover:border-white/20 transition-colors">
                     <div className="flex justify-between items-start">
                        <h4 className="text-lg font-black uppercase tracking-tighter">{stat.name}</h4>
                        <div className="flex gap-1">
                           {stat.reactions.slice(0, 3).map((r, ri) => (
                             <span key={ri} className="text-sm">{r}</span>
                           ))}
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <div className="text-xl font-black">{stat.views}</div>
                           <div className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Views</div>
                        </div>
                        <div>
                           <div className="text-xl font-black">{stat.clicks}</div>
                           <div className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Ações</div>
                        </div>
                     </div>
                  </div>
                )) : (
                  <div className="col-span-2 text-center py-12 text-neutral-600 text-[10px] uppercase font-black tracking-widest border border-dashed border-white/5">
                    Nenhuma interação com artistas
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
