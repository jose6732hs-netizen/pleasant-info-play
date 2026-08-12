import { createFileRoute, Link } from "@tanstack/react-router";
import { LayoutDashboard, Users, Calendar, Briefcase, FileText, Settings, LogOut, MousePointer2 } from "lucide-react";
import logoAsset from "@/assets/logo-completa.png.asset.json";

export const Route = createFileRoute("/admin/configuracoes")({
  component: AdminSettings,
});

function AdminSettings() {
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
          <Link to="/admin/configuracoes" className="p-3 bg-white/10 text-white transition rounded-sm font-bold flex items-center gap-3 mt-auto">
            <Settings className="w-4 h-4" /> Configurações
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-12">
          <header>
            <h1 className="text-4xl font-bold tracking-tighter uppercase">Configurações</h1>
            <p className="text-neutral-500 text-sm mt-2">Ajustes da conta e plataforma.</p>
          </header>

          <div className="space-y-8">
            <section className="p-8 border border-white/5 bg-neutral-900/30 rounded-sm space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Perfil do Administrador</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Nome de Exibição</label>
                        <input type="text" defaultValue="Administrador 064" className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">E-mail</label>
                        <input type="email" defaultValue="sempreteste552@gmail.com" className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition" />
                    </div>
                </div>
            </section>

            <section className="p-8 border border-white/5 bg-neutral-900/30 rounded-sm space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Segurança</h2>
                <button className="text-xs font-bold uppercase tracking-widest border border-white/10 px-6 py-3 rounded-full hover:bg-white/5 transition">
                    Alterar Senha
                </button>
            </section>
          </div>

          <div className="flex justify-end pt-8">
            <button 
              onClick={() => {
                localStorage.removeItem("064_auth_token");
                window.location.href = "/auth";
              }}
              className="bg-red-950/20 text-red-500 border border-red-900/30 px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-900/40 transition flex items-center gap-3"
            >
                <LogOut className="w-4 h-4" /> Sair do Sistema
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
