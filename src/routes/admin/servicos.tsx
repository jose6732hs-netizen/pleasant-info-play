import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

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
    <div className="p-6 md:p-12 space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase">Serviços</h1>
          <p className="text-neutral-500 text-sm mt-2">Gerencie os serviços oferecidos pela 064 Talents.</p>
        </div>
        <button className="w-full md:w-auto bg-white text-black px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Adicionar Serviço
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service, i) => (
          <div key={i} className="p-6 border border-white/5 bg-neutral-900/50 rounded-sm flex justify-between items-start gap-4 hover:bg-neutral-900 transition group">
            <div className="space-y-2">
              <h3 className="font-bold uppercase tracking-tight text-white group-hover:text-blue-400 transition">{service.title}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">{service.desc}</p>
            </div>
            <div className="flex flex-col gap-2 min-w-[60px] text-right">
              <button className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition">Editar</button>
              <button className="text-[10px] font-bold uppercase tracking-widest text-red-500/50 hover:text-red-500 transition">Remover</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
