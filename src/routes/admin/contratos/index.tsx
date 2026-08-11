import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getContracts } from "@/lib/contracts.functions";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Search, Filter, FileText, ChevronRight, LayoutDashboard, Users, Calendar, Briefcase, Settings, FileCheck } from "lucide-react";

export const Route = createFileRoute("/admin/contratos/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["contracts"],
      queryFn: () => getContracts(),
    });
  },
  component: AdminContracts,
});

function AdminContracts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");

  const { data: contracts } = useSuspenseQuery({
    queryKey: ["contracts"],
    queryFn: () => getContracts(),
  });

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = 
      c.contractor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.artist_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contract_number.includes(searchTerm);
    
    const matchesStatus = statusFilter === "TODOS" || c.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RASCUNHO': return 'text-neutral-400 bg-neutral-400/10 border-neutral-400/20';
      case 'AGUARDANDO ENVIO': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'ENVIADO': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'AGUARDANDO ASSINATURA': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'ASSINADO': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'CANCELADO': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'FINALIZADO': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 p-6 space-y-8 bg-black/20">
        <div className="text-xl font-bold tracking-tighter">064 ADMIN</div>
        <nav className="flex flex-col gap-2 text-sm text-neutral-400 uppercase tracking-widest">
          <Link to="/admin" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm flex items-center gap-3">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/admin/artistas" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm flex items-center gap-3">
            <Users className="w-4 h-4" /> Artistas
          </Link>
          <Link to="/admin/agenda" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm flex items-center gap-3">
            <Calendar className="w-4 h-4" /> Agenda
          </Link>
          <Link to="/admin/contratos" className="p-3 bg-white/10 text-white transition rounded-sm font-bold flex items-center gap-3">
            <FileCheck className="w-4 h-4" /> Contratos
          </Link>
          <Link to="/admin/solicitacoes" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm flex items-center gap-3">
            <FileText className="w-4 h-4" /> Solicitações
          </Link>
          <Link to="/admin/servicos" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm flex items-center gap-3">
            <Briefcase className="w-4 h-4" /> Serviços
          </Link>
          <Link to="/admin/configuracoes" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm mt-auto flex items-center gap-3">
            <Settings className="w-4 h-4" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-12">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase">Gestão de Contratos</h1>
              <p className="text-neutral-500 text-sm mt-2">Acompanhamento jurídico e financeiro de fechamentos.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative group flex-1 sm:min-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-white transition" />
                <input 
                  type="text" 
                  placeholder="Buscar por contrato, artista ou contratante..." 
                  className="w-full bg-neutral-900 border border-white/5 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-white/20 transition rounded-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-neutral-900 border border-white/5 py-2.5 px-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-white/20 transition rounded-sm"
              >
                <option value="TODOS">TODOS OS STATUS</option>
                <option value="RASCUNHO">RASCUNHO</option>
                <option value="AGUARDANDO ENVIO">AGUARDANDO ENVIO</option>
                <option value="ENVIADO">ENVIADO</option>
                <option value="AGUARDANDO ASSINATURA">AGUARDANDO ASSINATURA</option>
                <option value="ASSINADO">ASSINADO</option>
                <option value="FINALIZADO">FINALIZADO</option>
                <option value="CANCELADO">CANCELADO</option>
              </select>
            </div>
          </header>

          <div className="bg-neutral-900/50 border border-white/5 rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-black/20">
                    <th className="p-4 text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Nº Contrato</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Artista / Evento</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Contratante</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Data / Local</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-neutral-500 tracking-widest text-right">Valor</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Status</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredContracts.length > 0 ? (
                    filteredContracts.map((contract) => (
                      <tr key={contract.id} className="hover:bg-white/5 transition group">
                        <td className="p-4 font-mono text-xs">{contract.contract_number}</td>
                        <td className="p-4">
                          <div className="font-bold">{contract.artist_name}</div>
                          <div className="text-[10px] text-neutral-500 uppercase tracking-widest">{contract.event_name}</div>
                        </td>
                        <td className="p-4 text-neutral-300">{contract.contractor_name}</td>
                        <td className="p-4">
                          <div>{format(parseISO(contract.event_date), "dd/MM/yyyy")}</div>
                          <div className="text-[10px] text-neutral-500 uppercase tracking-widest">{contract.city} - {contract.state}</div>
                        </td>
                        <td className="p-4 text-right font-bold text-white">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contract.total_value)}
                        </td>
                        <td className="p-4">
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 border rounded-full inline-block ${getStatusColor(contract.status)}`}>
                            {contract.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Link 
                            to="/admin/contratos/$id" 
                            params={{ id: contract.id }}
                            className="text-neutral-500 group-hover:text-white transition"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-24 text-center text-neutral-600 text-[10px] uppercase tracking-widest">
                        Nenhum contrato encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm space-y-1">
              <div className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Contratos Ativos</div>
              <div className="text-3xl font-black tracking-tighter">{contracts.filter(c => ['ENVIADO', 'AGUARDANDO ASSINATURA', 'ASSINADO'].includes(c.status)).length}</div>
            </div>
            <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm space-y-1">
              <div className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Aguardando Assinatura</div>
              <div className="text-3xl font-black tracking-tighter">{contracts.filter(c => c.status === 'AGUARDANDO ASSINATURA').length}</div>
            </div>
            <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm space-y-1 text-green-500">
              <div className="text-[10px] uppercase font-bold text-neutral-500/50 tracking-widest">Eventos Confirmados</div>
              <div className="text-3xl font-black tracking-tighter">{contracts.filter(c => c.status === 'ASSINADO').length}</div>
            </div>
            <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm space-y-1 text-yellow-500">
              <div className="text-[10px] uppercase font-bold text-neutral-500/50 tracking-widest">Pagamentos Pendentes</div>
              <div className="text-3xl font-black tracking-tighter">0</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
