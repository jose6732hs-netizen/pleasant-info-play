import { createFileRoute, Link } from "@tanstack/react-router";
import { LayoutDashboard, Users, Calendar, Briefcase, FileText, Settings, Plus, MousePointer2 } from "lucide-react";
import logoAsset from "@/assets/logo-completa.png.asset.json";

export const Route = createFileRoute("/admin/servicos")({
  component: AdminServices,
});

function AdminServices() {
  const services = [
    { title: "Booking Artístico", desc: "Comercialização oficial de datas, negociação de cachês e fechamento de shows." },
    { title: "Representação Artística", desc: "Conectamos artistas a contratantes, produtores, eventos e novos mercados." },
    { title: "Gestão de Agenda", desc: "Organização comercial de datas, propostas, contratos e oportunidades." },
    { title: "Negociação Comercial", desc: "Intermediação profissional entre artista e contratante." },
    { title: "Produção Artística", desc: "Suporte de logística, rider, horários, transporte, hospedagem e produção." },
    { title: "Curadoria Artística", desc: "Montagem de line-ups e seleção de artistas para eventos." },
    { title: "Eventos & Projetos", desc: "Desenvolvimento de eventos, festivais, turnês e projetos especiais." },
    { title: "Parcerias Comerciais", desc: "Conexão entre artistas, marcas e grandes eventos." },
  ];

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
          <Link to="/admin/configuracoes" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm flex items-center gap-3 mt-auto">
            <Settings className="w-4 h-4" /> Configurações
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-12">
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase">Serviços</h1>
              <p className="text-neutral-500 text-sm mt-2">Gerencie os serviços oferecidos pela 064 Talents.</p>
            </div>
            <button className="bg-white text-black px-6 py-2 rounded-full text-xs font-bold uppercase hover:bg-neutral-200 transition">
              Adicionar Serviço
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, i) => (
              <div key={i} className="p-6 border border-white/5 bg-neutral-900/50 rounded-sm flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <h3 className="font-bold uppercase tracking-tight text-white">{service.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{service.desc}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition">Editar</button>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-destructive hover:text-destructive/80 transition">Remover</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
