import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getActiveArtists } from "@/lib/cms.functions";
import { getRealAnalyticsEvents } from "@/lib/analytics/tracker.functions";
import { Users, TrendingUp, Heart, MousePointer2, Eye, MessageSquare, Award } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/admin/artistas/")({
  component: AdminArtistsRanking,
});

function AdminArtistsRanking() {
  const { data: artists, isLoading: loadingArtists } = useQuery({
    queryKey: ["active-artists"],
    queryFn: () => getActiveArtists(),
  });

  const { data: events, isLoading: loadingEvents } = useQuery({
    queryKey: ["analytics-events"],
    queryFn: () => getRealAnalyticsEvents(),
    refetchInterval: 10000,
  });

  const ranking = useMemo(() => {
    if (!artists || !events) return [];

    return artists.map(artist => {
      const artistEvents = events.filter(e => e.artist_id === artist.id);
      
      const stats = {
        views: artistEvents.filter(e => e.type === 'artist_view').length,
        clicks: artistEvents.filter(e => e.type === 'artist_click').length,
        contacts: artistEvents.filter(e => e.type === 'artist_contact').length,
        reactions: artistEvents.filter(e => e.type === 'artist_reaction').length,
        videoPlays: artistEvents.filter(e => e.type === 'artist_video_play').length,
        shares: artistEvents.filter(e => e.type === 'artist_share').length,
        uniqueVisitors: new Set(artistEvents.map(e => e.visitor_id)).size,
        conversionRate: artistEvents.filter(e => e.type === 'artist_view').length > 0 
          ? (artistEvents.filter(e => e.type === 'artist_contact').length / artistEvents.filter(e => e.type === 'artist_view').length) * 100
          : 0
      };

      return {
        ...artist,
        stats
      };
    }).sort((a, b) => b.stats.views - a.stats.views);
  }, [artists, events]);

  if (loadingArtists || loadingEvents) {
    return (
      <div className="p-12 flex items-center justify-center">
        <div className="text-neutral-500 text-xs uppercase tracking-[0.3em] animate-pulse">Analizando tráfego dos artistas...</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 space-y-12 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Ranking de Artistas</h1>
        <p className="text-neutral-500 text-sm uppercase tracking-widest">Performance real baseada em interações e conversões.</p>
      </header>

      {/* Top 3 Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ranking.slice(0, 3).map((artist, idx) => (
          <Link 
            key={artist.id} 
            to="/admin/artistas/$id" 
            params={{ id: artist.id }}
            className="group relative bg-neutral-900/40 border border-white/5 p-8 space-y-6 hover:bg-white hover:border-white transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 group-hover:text-black transition-opacity">
               <Award className={idx === 0 ? "w-16 h-16 text-yellow-500" : idx === 1 ? "w-16 h-16 text-neutral-400" : "w-16 h-16 text-amber-700"} />
            </div>
            
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 group-hover:text-black/40 transition-colors">#{idx + 1} LUGAR</span>
              <h3 className="text-3xl font-black uppercase tracking-tighter group-hover:text-black transition-colors">{artist.name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="space-y-1">
                <div className="text-[8px] font-black text-neutral-500 uppercase tracking-widest group-hover:text-black/40">Visualizações</div>
                <div className="text-xl font-bold group-hover:text-black">{artist.stats.views}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[8px] font-black text-neutral-500 uppercase tracking-widest group-hover:text-black/40">Conversão</div>
                <div className="text-xl font-bold group-hover:text-black">{artist.stats.conversionRate.toFixed(1)}%</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Ranking Table */}
      <div className="space-y-6">
        <h2 className="text-xl font-black tracking-tighter uppercase border-b border-white/5 pb-4">Ranking Completo</h2>
        <div className="border border-white/5 bg-neutral-900/50 rounded-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[1000px]">
            <thead>
              <tr className="border-b border-white/5 bg-black/40 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                <th className="p-4">Artista</th>
                <th className="p-4 text-center">Views</th>
                <th className="p-4 text-center">Cliques</th>
                <th className="p-4 text-center">Conversões</th>
                <th className="p-4 text-center">Vídeos</th>
                <th className="p-4 text-center">Reações</th>
                <th className="p-4 text-center">Compart.</th>
                <th className="p-4 text-right">Taxa Conv.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ranking.map((artist) => (
                <tr key={artist.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <Link to="/admin/artistas/$id" params={{ id: artist.id }} className="flex items-center gap-4 hover:underline">
                      <div className="w-10 h-10 bg-neutral-800 rounded-sm overflow-hidden flex-shrink-0">
                        <img src={artist.photo_url} className="w-full h-full object-cover grayscale" />
                      </div>
                      <div className="font-bold uppercase tracking-tight">{artist.name}</div>
                    </Link>
                  </td>
                  <td className="p-4 text-center font-mono">{artist.stats.views}</td>
                  <td className="p-4 text-center font-mono">{artist.stats.clicks}</td>
                  <td className="p-4 text-center font-mono text-blue-400">{artist.stats.contacts}</td>
                  <td className="p-4 text-center font-mono">{artist.stats.videoPlays}</td>
                  <td className="p-4 text-center font-mono text-red-400">{artist.stats.reactions}</td>
                  <td className="p-4 text-center font-mono">{artist.stats.shares}</td>
                  <td className="p-4 text-right font-bold text-green-500">{artist.stats.conversionRate.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
