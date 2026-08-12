import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getArtistBySlug, getAllArtists } from "@/lib/cms.functions";
import { getRealAnalyticsEvents } from "@/lib/analytics/tracker.functions";
import { 
  Eye, 
  MousePointer2, 
  MessageSquare, 
  Heart, 
  Share2, 
  Video, 
  MapPin, 
  Globe, 
  Smartphone, 
  Monitor,
  Clock,
  TrendingUp,
  ArrowLeft
} from "lucide-react";
import { useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/admin/artistas/$id")({
  component: AdminArtistDetail,
});

function AdminArtistDetail() {
  const { id } = Route.useParams();
  
  const { data: allArtists } = useQuery({
    queryKey: ["all-artists"],
    queryFn: () => getAllArtists(),
  });

  const artist = useMemo(() => allArtists?.find(a => a.id === id), [allArtists, id]);

  const { data: events } = useQuery({
    queryKey: ["analytics-events"],
    queryFn: () => getRealAnalyticsEvents(),
    refetchInterval: 10000,
  });

  const artistEvents = useMemo(() => events?.filter(e => e.artist_id === id) || [], [events, id]);

  const stats = useMemo(() => {
    return {
      views: artistEvents.filter(e => e.type === 'artist_view').length,
      clicks: artistEvents.filter(e => e.type === 'artist_click').length,
      contacts: artistEvents.filter(e => e.type === 'artist_contact').length,
      reactions: artistEvents.filter(e => e.type === 'artist_reaction').length,
      videoPlays: artistEvents.filter(e => e.type === 'artist_video_play').length,
      shares: artistEvents.filter(e => e.type === 'artist_share').length,
      uniqueVisitors: new Set(artistEvents.map(e => e.visitor_id)).size,
    };
  }, [artistEvents]);

  const deviceStats = useMemo(() => {
    const counts: Record<string, number> = {};
    artistEvents.forEach(e => {
      const ua = e.client_info?.userAgent || 'Unknown';
      const device = ua.includes('Mobile') ? 'Mobile' : 'Desktop';
      counts[device] = (counts[device] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [artistEvents]);

  const locationStats = useMemo(() => {
    const cities: Record<string, number> = {};
    const regions: Record<string, number> = {};
    artistEvents.forEach(e => {
      if (e.location?.city) cities[e.location.city] = (cities[e.location.city] || 0) + 1;
      if (e.location?.region) regions[e.location.region] = (regions[e.location.region] || 0) + 1;
    });
    return {
      cities: Object.entries(cities).sort((a, b) => b[1] - a[1]).slice(0, 5),
      regions: Object.entries(regions).sort((a, b) => b[1] - a[1]).slice(0, 5)
    };
  }, [artistEvents]);

  if (!artist) {
    return (
       <div className="p-12 text-center text-neutral-500 uppercase tracking-widest text-xs">Artista não encontrado</div>
    );
  }

  return (
    <div className="p-6 md:p-12 space-y-12 pb-24">
      <header className="space-y-6">
        <Link to="/admin/artistas" className="flex items-center gap-2 text-neutral-500 hover:text-white transition group text-[10px] font-black uppercase tracking-[0.3em]">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar Ranking
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-neutral-900 border border-white/10 rounded-sm overflow-hidden flex-shrink-0">
               <img src={artist.photo_url} className="w-full h-full object-cover grayscale" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">{artist.name}</h1>
              <p className="text-neutral-500 text-sm uppercase tracking-widest">{artist.genre} • {artist.city}, {artist.state}</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-sm text-center">
                <div className="text-[8px] font-black text-neutral-500 uppercase tracking-widest mb-1">Taxa de Conversão</div>
                <div className="text-xl font-bold text-green-500">
                  {stats.views > 0 ? ((stats.contacts / stats.views) * 100).toFixed(1) : '0.0'}%
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Views', value: stats.views, icon: Eye, color: 'text-blue-500' },
          { label: 'Visitantes Únicos', value: stats.uniqueVisitors, icon: Users, color: 'text-white' },
          { label: 'Cliques', value: stats.clicks, icon: MousePointer2, color: 'text-neutral-500' },
          { label: 'Conversões', value: stats.contacts, icon: MessageSquare, color: 'text-green-500' },
          { label: 'Reações', value: stats.reactions, icon: Heart, color: 'text-red-500' },
          { label: 'Video Plays', value: stats.videoPlays, icon: Video, color: 'text-purple-500' },
          { label: 'Compartilhamentos', value: stats.shares, icon: Share2, color: 'text-blue-400' },
          { label: 'Eventos Totais', value: artistEvents.length, icon: TrendingUp, color: 'text-white' },
        ].map((stat, i) => (
          <div key={i} className="bg-neutral-900/40 border border-white/5 p-6 rounded-sm space-y-4">
            <div className="flex items-center justify-between">
              <stat.icon className={} />
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-black tracking-tighter uppercase">{stat.value}</div>
              <div className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Geo Distribution */}
        <div className="bg-neutral-900/30 border border-white/5 p-8 rounded-sm space-y-8">
           <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 border-b border-white/5 pb-4">Geolocalização</h3>
           
           <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Principais Cidades</h4>
                <div className="space-y-2">
                  {locationStats.cities.map(([city, count]) => (
                    <div key={city} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-blue-500" />
                        <span className="text-xs font-bold uppercase tracking-tight">{city}</span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Principais Estados</h4>
                <div className="space-y-2">
                  {locationStats.regions.map(([region, count]) => (
                    <div key={region} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3 text-neutral-400" />
                        <span className="text-xs font-bold uppercase tracking-tight">{region}</span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
           </div>
        </div>

        {/* Devices & Tech */}
        <div className="bg-neutral-900/30 border border-white/5 p-8 rounded-sm space-y-8">
           <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 border-b border-white/5 pb-4">Dispositivos</h3>
           
           <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                 {deviceStats.map(([device, count]) => (
                   <div key={device} className="bg-black/40 border border-white/5 p-6 rounded-sm space-y-4 text-center">
                      <div className="flex justify-center">
                         {device === 'Mobile' ? <Smartphone className="w-6 h-6 text-neutral-500" /> : <Monitor className="w-6 h-6 text-neutral-500" />}
                      </div>
                      <div className="space-y-1">
                        <div className="text-xl font-black">{count}</div>
                        <div className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">{device}</div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Visitor Journey Table */}
      <div className="space-y-6">
        <h2 className="text-xl font-black tracking-tighter uppercase border-b border-white/5 pb-4">Jornada dos Visitantes</h2>
        <div className="border border-white/5 bg-neutral-900/50 rounded-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 bg-black/40 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                <th className="p-4">Hora</th>
                <th className="p-4">Evento</th>
                <th className="p-4">Local</th>
                <th className="p-4">UTM Source</th>
                <th className="p-4 text-right">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {artistEvents.slice().reverse().map((event: any) => (
                <tr key={event.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-neutral-600" />
                      <span className="text-[10px] font-mono">{format(new Date(event.timestamp), "HH:mm:ss", { locale: ptBR })}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-neutral-800 rounded-full">
                      {event.type.replace('artist_', '')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-[10px] uppercase font-bold tracking-tight">{event.location?.city || 'Desconhecido'}</div>
                    <div className="text-[8px] text-neutral-500 uppercase">{event.location?.region || 'N/A'}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-mono text-neutral-400">{event.utm?.source || 'Direto'}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-[8px] font-mono text-neutral-600 truncate max-w-[200px]">
                      {JSON.stringify(event.metadata || {})}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
