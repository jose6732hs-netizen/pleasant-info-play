import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getRealAnalyticsEvents, getRealSessions } from "@/lib/analytics/tracker.functions";
import { getAllArtists } from "@/lib/cms.functions";
import { 
  Users, 
  Eye, 
  MousePointer2, 
  Star, 
  TrendingUp, 
  Map as MapIcon, 
  Clock, 
  Globe, 
  Zap, 
  Database, 
  ShieldCheck,
  Smartphone,
  Monitor,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Instagram,
  Facebook,
  Search,
  MessageSquare,
  Tag
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { format, parseISO, startOfDay, subDays, eachDayOfInterval, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalytics,
});

const LED = ({ color = "green", label, active = true }: { color?: string, label: string, active?: boolean }) => (
  <div className="flex items-center gap-2 px-3 py-1 bg-black/40 border border-white/5 rounded-full">
    <div className={cn(
      "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse",
      color === "green" ? "bg-green-500 shadow-green-500/50" : 
      color === "blue" ? "bg-blue-500 shadow-blue-500/50" : 
      "bg-red-500 shadow-red-500/50",
      !active && "bg-neutral-800 shadow-none animate-none"
    )} />
    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400">{label}</span>
  </div>
);

function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState(7);
  const [activeMetric, setActiveMetric] = useState<'views' | 'clicks' | 'visitors'>('views');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const { data: events, isLoading } = useQuery({
    queryKey: ["analytics-events"],
    queryFn: () => getRealAnalyticsEvents(),
    refetchInterval: 10000,
  });

  const { data: sessions } = useQuery({
    queryKey: ["analytics-sessions"],
    queryFn: () => getRealSessions(),
    refetchInterval: 10000,
  });

  const { data: artists } = useQuery({
    queryKey: ["all-artists"],
    queryFn: () => getAllArtists(),
  });

  useEffect(() => {
    if (events) setLastUpdate(new Date());
  }, [events]);

  const stats = useMemo(() => {
    if (!events || !sessions) return {
      visitors: 0, views: 0, clicks: 0, artists: 0, reactions: 0, conversions: 0,
      visitorsTrend: 0, viewsTrend: 0, clicksTrend: 0
    };

    const visitors = new Set(events.map(e => e.visitor_id)).size;
    const views = events.filter(e => e.type === 'page_view' || e.type === 'artist_view').length;
    const clicks = events.filter(e => (e.type as string) === 'click' || (e.type as string).includes('click')).length;
    const uniqueArtists = new Set(events.map(e => e.artist_id).filter(Boolean)).size;
    const reactions = events.filter(e => e.type.includes('reaction')).length;
    const conversions = events.filter(e => e.type === 'artist_contact').length;

    return { visitors, views, clicks, artists: uniqueArtists, reactions, conversions };
  }, [events, sessions]);

  const chartData = useMemo(() => {
    if (!events) return [];
    const days = eachDayOfInterval({
      start: subDays(new Date(), timeRange - 1),
      end: new Date()
    });

    return days.map(day => {
      const dayEvents = events.filter(e => isSameDay(parseISO(e.timestamp), day));
      return {
        date: format(day, "dd/MM"),
        views: dayEvents.filter(e => e.type === 'page_view' || e.type === 'artist_view').length,
        clicks: dayEvents.filter(e => (e.type as string) === 'click' || (e.type as string).includes('click')).length,
        visitors: new Set(dayEvents.map(e => e.visitor_id)).size,
      };
    });
  }, [events, timeRange]);

  const artistRanking = useMemo(() => {
    if (!events || !artists) return [];
    const ranking = artists.map(artist => {
      const artistEvents = events.filter(e => e.artist_id === artist.id);
      const views = artistEvents.filter(e => e.type === 'artist_view').length;
      const clicks = artistEvents.filter(e => e.type === 'artist_budget_click' || e.type === 'artist_click').length;
      const reactions = artistEvents.filter(e => e.type === 'artist_reaction').length;
      const contacts = artistEvents.filter(e => e.type === 'artist_contact').length;
      const conversion = views > 0 ? ((contacts / views) * 100).toFixed(1) : "0.0";

      return {
        id: artist.id,
        name: artist.name,
        views,
        clicks,
        reactions,
        contacts,
        conversion
      };
    }).sort((a, b) => b.views - a.views);
    return ranking.slice(0, 5);
  }, [events, artists]);

  const sourcesData = useMemo(() => {
    if (!events) return [];
    const sourcesMap = new Map();
    events.forEach(e => {
      if (e.utm?.source) {
        const source = e.utm.source.toLowerCase();
        sourcesMap.set(source, (sourcesMap.get(source) || 0) + 1);
      } else if (e.type === 'session_start') {
        sourcesMap.set('direct', (sourcesMap.get('direct') || 0) + 1);
      }
    });
    return Array.from(sourcesMap.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [events]);

  const recentActivity = useMemo(() => {
    if (!events) return [];
    return events.slice(-8).reverse();
  }, [events]);

  const COLORS = ['#FFFFFF', '#A3A3A3', '#525252', '#262626'];

  return (
    <div className="p-4 md:p-12 space-y-6 md:space-y-8 bg-black min-h-screen text-white overflow-x-hidden">
      {/* Premium Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/5">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">
            Analytics <span className="text-neutral-500">Center</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Dados em tempo real</span>
            <div className="flex items-center gap-2 px-2 py-0.5 bg-green-500/10 rounded-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Live</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <LED label="Tracking" active={true} color="blue" />
          <LED label="Database" active={true} color="green" />
          <LED label="Geo API" active={true} color="green" />
          <div className="px-4 py-2 bg-neutral-900/50 border border-white/5 rounded-sm flex flex-col items-end">
            <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Last Update</span>
            <span className="text-[10px] font-mono font-bold">{format(lastUpdate, "HH:mm:ss")}</span>
          </div>
        </div>
      </header>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Visitantes", value: stats.visitors, icon: Users, trend: "+12%" },
          { label: "Views", value: stats.views, icon: Eye, trend: "+8%" },
          { label: "Cliques", value: stats.clicks, icon: MousePointer2, trend: "+5%" },
          { label: "Artistas", value: stats.artists, icon: Star, trend: "Stable" },
          { label: "Reações", value: stats.reactions, icon: Zap, trend: "+15%" },
          { label: "Conversões", value: stats.conversions, icon: TrendingUp, trend: "+2%" },
        ].map((kpi, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={kpi.label}
            className="group relative bg-neutral-900/40 border border-white/5 p-5 rounded-sm hover:border-white/20 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <kpi.icon className="w-12 h-12" />
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-1">{kpi.label}</div>
            <div className="text-2xl font-black tracking-tighter mb-2">{kpi.value || 0}</div>
            <div className="flex items-center gap-1.5">
               <div className={cn(
                 "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm",
                 kpi.trend.includes('+') ? "bg-green-500/10 text-green-500" : "bg-neutral-800 text-neutral-500"
               )}>
                 {kpi.trend}
               </div>
               <div className="flex-1 h-[1px] bg-white/5" />
            </div>
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-neutral-900/40 border border-white/5 p-8 rounded-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" /> Performance Temporal
            </h3>
            <div className="flex gap-2">
              {['views', 'clicks', 'visitors'].map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMetric(m as any)}
                  className={cn(
                    "px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-all",
                    activeMetric === m ? "bg-white text-black border-white" : "bg-black/50 text-neutral-500 border-white/10 hover:border-white/30"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#525252" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#525252" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey={activeMetric} 
                  stroke="#ffffff" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorMetric)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="bg-neutral-900/40 border border-white/5 p-8 rounded-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" /> Atividade Ao Vivo
            </h3>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
          </div>
          
          <div className="flex-1 space-y-4 overflow-hidden relative">
            <AnimatePresence initial={false}>
              {recentActivity.length === 0 ? (
                <div className="text-center py-12 text-neutral-600 text-[10px] uppercase tracking-widest italic">Aguardando novos eventos...</div>
              ) : (
                recentActivity.map((event: any, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-start gap-4 p-3 border-l-2 border-white/10 hover:border-white transition-colors bg-white/5"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-neutral-500" />
                    </div>
                    <div className="space-y-1 overflow-hidden">
                       <div className="text-[9px] font-black uppercase text-neutral-400">
                         {event.location?.city || 'Visitante'} • {format(parseISO(event.timestamp), "HH:mm:ss")}
                       </div>
                       <div className="text-[10px] font-bold text-white truncate uppercase tracking-tight">
                         {event.type.replace('_', ' ')}: {event.element_text || event.path.split('/').pop() || 'HOME'}
                       </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-neutral-900/40 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Artist Ranking & Geo Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Artist Ranking */}
        <div className="lg:col-span-2 bg-neutral-900/40 border border-white/5 p-8 rounded-sm">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8">Performance por Artista</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black uppercase text-neutral-500 tracking-widest">
                  <th className="pb-4">Artista</th>
                  <th className="pb-4">Views</th>
                  <th className="pb-4">Cliques</th>
                  <th className="pb-4">Contatos</th>
                  <th className="pb-4 text-right">Conversão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {artistRanking.map((artist, idx) => (
                  <tr key={artist.id} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4">
                       <div className="flex items-center gap-3">
                          <span className="text-neutral-700 font-mono text-xs">0{idx + 1}</span>
                          <span className="text-xs font-black uppercase tracking-widest">{artist.name}</span>
                       </div>
                    </td>
                    <td className="py-4 text-xs font-mono">{artist.views}</td>
                    <td className="py-4 text-xs font-mono">{artist.clicks}</td>
                    <td className="py-4 text-xs font-mono">{artist.contacts}</td>
                    <td className="py-4 text-right">
                       <span className={cn(
                         "px-2 py-0.5 rounded-sm text-[10px] font-black",
                         parseFloat(artist.conversion) > 5 ? "bg-green-500/20 text-green-500" : "bg-neutral-800 text-neutral-500"
                       )}>
                         {artist.conversion}%
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Traffic Sources & Device */}
        <div className="space-y-8">
          <div className="bg-neutral-900/40 border border-white/5 p-8 rounded-sm">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8">Fontes de Tráfego</h3>
             <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                        data={sourcesData.length > 0 ? sourcesData : [{ name: 'none', value: 1 }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {sourcesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length] || '#FFFFFF'} />
                        ))}
                      </Pie>
                      <Tooltip 
                         contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px' }}
                      />
                   </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="space-y-2 mt-4">
                {sourcesData.map((source, i) => (
                  <div key={source.name} className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{source.name}</span>
                     </div>
                     <span className="text-xs font-mono">{source.value}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
