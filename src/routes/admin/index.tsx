import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getAdminStats } from "@/lib/admin.functions";
import { LayoutDashboard, Users, Calendar, Briefcase, FileText, Settings, Star, TrendingUp } from "lucide-react";
import logoAsset from "@/assets/logo-completa.png.asset.json";

export const Route = createFileRoute("/admin/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["admin-stats"],
      queryFn: () => getAdminStats(),
    });
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: stats } = useSuspenseQuery({
    queryKey: ["admin-stats"],
    queryFn: () => getAdminStats(),
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row w-full">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 p-6 space-y-8 bg-black/20">
        <div className="flex justify-start mb-8">
          <img src={logoAsset.url} alt="064 ADMIN" className="h-8 w-auto object-contain grayscale brightness-200" />
        </div>
        <nav className="flex flex-col gap-2 text-sm text-neutral-400 uppercase tracking-widest">
          <Link to="/admin" className="p-3 bg-white/10 text-white transition rounded-sm font-bold flex items-center gap-3">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/admin/artistas" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm flex items-center gap-3">
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
          <header className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase">Dashboard</h1>
              <p className="text-neutral-500 text-sm mt-2">Visão geral do mercado 064 Talents.</p>
            </div>
            <div className="hidden md:block">
               <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">Sistema Online</span>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Artistas Ativos", value: stats.activeArtists.toString().padStart(2, '0'), sub: "Total em casting", icon: Users },
              { label: "Shows Confirmados", value: stats.confirmedShows.toString().padStart(2, '0'), sub: "Este mês", icon: Calendar },
              { label: "Novas Solicitações", value: stats.newRequests.toString().padStart(2, '0'), sub: "Aguardando análise", icon: FileText },
              { label: "Taxa de Fechamento", value: "85%", sub: "Conversão mensal", icon: TrendingUp }
            ].map((stat, i) => (
              <div key={i} className="p-8 border border-white/5 bg-neutral-900/50 rounded-sm hover:bg-neutral-900 transition relative overflow-hidden group">
                <stat.icon className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 group-hover:text-white/10 transition-colors" />
                <div className="text-neutral-500 text-[9px] uppercase tracking-widest mb-4 font-bold relative z-10">{stat.label}</div>
                <div className="text-5xl font-black tracking-tighter mb-2 relative z-10">{stat.value}</div>
                <div className="text-[10px] text-neutral-600 uppercase tracking-widest relative z-10">{stat.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tighter uppercase border-b border-white/5 pb-4">Ações Rápidas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/admin/artistas" className="p-6 border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs font-bold uppercase tracking-widest transition flex flex-col gap-4">
                  <Users className="w-5 h-5 text-neutral-500" />
                  Gerenciar Casting
                </Link>
                <Link to="/admin/solicitacoes" className="p-6 border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs font-bold uppercase tracking-widest transition flex flex-col gap-4">
                  <FileText className="w-5 h-5 text-neutral-500" />
                  Ver Solicitações
                </Link>
                <Link to="/admin/agenda" className="p-6 border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs font-bold uppercase tracking-widest transition flex flex-col gap-4">
                  <Calendar className="w-5 h-5 text-neutral-500" />
                  Atualizar Agenda
                </Link>
                <Link to="/admin/conteudo" className="p-6 border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs font-bold uppercase tracking-widest transition flex flex-col gap-4">
                  <Star className="w-5 h-5 text-neutral-500" />
                  Editar Site
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tighter uppercase border-b border-white/5 pb-4">Monitoramento</h2>
              <div className="bg-neutral-900/30 border border-white/5 p-8 rounded-sm space-y-6">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-neutral-500">Uso de Tráfego</span>
                  <span className="text-white">Normal</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className="bg-white w-[35%] h-full"></div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-neutral-500">Armazenamento</span>
                  <span className="text-white">12% utilizado</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className="bg-white w-[12%] h-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
