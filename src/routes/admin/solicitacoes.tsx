import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookingRequests, updateBookingRequestStatus } from "@/lib/admin.functions";
import { generateContractFromProposal } from "@/lib/contracts.functions";
import { getActiveArtists } from "@/lib/cms.functions";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";
import { FileText, CheckCircle, XCircle, Clock, DollarSign, Send } from "lucide-react";

export const Route = createFileRoute("/admin/solicitacoes")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData({
        queryKey: ["booking-requests"],
        queryFn: () => getBookingRequests(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["active-artists"],
        queryFn: () => getActiveArtists(),
      }),
    ]);
  },
  component: AdminBookings,
});

function AdminBookings() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("TODAS");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [proposalData, setProposalData] = useState({
    cache: "",
    comissao: "20",
    despesas: "",
    validade: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd")
  });

  const { data: requests } = useSuspenseQuery({
    queryKey: ["booking-requests"],
    queryFn: () => getBookingRequests(),
  });

  const { data: artists } = useSuspenseQuery({
    queryKey: ["active-artists"],
    queryFn: () => getActiveArtists(),
  });

  const statusMutation = useMutation({
    mutationFn: (variables: { id: string, status: string }) => updateBookingRequestStatus({ data: variables }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking-requests"] });
      toast.success("Status atualizado!");
      setSelectedRequest(null);
    }
  });

  const contractMutation = useMutation({
    mutationFn: (variables: any) => generateContractFromProposal({ data: variables }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      toast.success("Contrato gerado com sucesso!");
      // Could redirect to contract details
    },
    onError: () => toast.error("Erro ao gerar contrato")
  });

  const filteredRequests = requests?.filter((r: any) => 
    filter === "TODAS" || r.status === filter
  );

  const getArtistName = (id: string) => artists?.find(a => a.id === id)?.name || "N/A";

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOVA': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'PROPOSTA_ENVIADA': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'CONFIRMADA': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'RECUSADA': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 p-6 space-y-8 bg-black/20">
        <div className="text-xl font-bold tracking-tighter">064 ADMIN</div>
        <nav className="flex flex-col gap-2 text-sm text-neutral-400 uppercase tracking-widest">
          <a href="/admin" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Dashboard</a>
          <a href="/admin/artistas" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Artistas</a>
          <a href="/admin/agenda" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Agenda</a>
          <a href="/admin/servicos" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Serviços</a>
          <a href="/admin/conteudo" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm">Conteúdo</a>
          <a href="/admin/solicitacoes" className="p-3 bg-white/10 text-white transition rounded-sm font-bold">Solicitações</a>
          <a href="/admin/configuracoes" className="p-3 hover:bg-white/5 hover:text-white transition rounded-sm mt-auto">Configurações</a>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-12">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase">Solicitações</h1>
              <p className="text-neutral-500 text-sm mt-2">Pedidos de contratação e negociações em curso.</p>
            </div>
            
            <div className="flex gap-2 bg-neutral-900 p-1 rounded-sm border border-white/5">
              {['TODAS', 'NOVA', 'PROPOSTA_ENVIADA', 'CONFIRMADA'].map((f) => (
                <button 
                  key={f} 
                  onClick={() => setFilter(f)}
                  className={`text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-sm transition ${filter === f ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
                >
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>
          </header>

          <div className="grid grid-cols-1 gap-4">
            {filteredRequests && filteredRequests.length > 0 ? (
              filteredRequests.map((req: any) => (
                <div key={req.id} className="bg-neutral-900 border border-white/5 hover:border-white/10 transition p-6 rounded-sm grid md:grid-cols-4 gap-6 items-center">
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Contratante</div>
                    <div className="font-bold">{req.name}</div>
                    <div className="text-xs text-neutral-400">{req.whatsapp}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Artista & Data</div>
                    <div className="font-bold">{getArtistName(req.artist_id)}</div>
                    <div className="text-xs text-neutral-400">{req.event_date ? format(parseISO(req.event_date), "dd/MM/yyyy") : "A definir"}</div>
                  </div>

                  <div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 border rounded-full ${getStatusColor(req.status)}`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setSelectedRequest(req)}
                      className="bg-white/5 hover:bg-white text-neutral-400 hover:text-black p-2 rounded-sm transition border border-white/5"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    {req.status === 'NOVA' && (
                      <button 
                        onClick={() => statusMutation.mutate({ id: req.id, status: 'PROPOSTA_ENVIADA' })}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm transition"
                      >
                        Enviar Proposta
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 border border-dashed border-white/5 rounded-sm">
                <p className="text-neutral-600 text-[10px] uppercase tracking-widest">Nenhuma solicitação nesta categoria.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Proposal/Detail Drawer */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-neutral-900 border-l border-white/10 p-8 h-full overflow-y-auto space-y-8 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-start">
              <h2 className="text-3xl font-black uppercase tracking-tighter">Detalhes da Solicitação</h2>
              <button onClick={() => setSelectedRequest(null)} className="text-neutral-500 hover:text-white">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-[9px] uppercase font-bold text-neutral-600 tracking-widest">Contratante</div>
                  <div className="text-lg font-bold">{selectedRequest.name}</div>
                  <div className="text-sm text-neutral-400">{selectedRequest.email}</div>
                  <div className="text-sm text-neutral-400">{selectedRequest.whatsapp}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] uppercase font-bold text-neutral-600 tracking-widest">Mensagem</div>
                  <div className="text-sm italic text-neutral-500">"{selectedRequest.message || "Sem mensagem adicional."}"</div>
                </div>
              </div>
              
              <div className="space-y-4 text-right">
                <div className="space-y-1">
                  <div className="text-[9px] uppercase font-bold text-neutral-600 tracking-widest">Status Atual</div>
                  <div className={`text-sm font-bold uppercase tracking-widest ${getStatusColor(selectedRequest.status).split(' ')[0]}`}>
                    {selectedRequest.status.replace('_', ' ')}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] uppercase font-bold text-neutral-600 tracking-widest">Enviado em</div>
                  <div className="text-sm text-neutral-400">{format(parseISO(selectedRequest.created_at), "dd/MM/yyyy HH:mm")}</div>
                </div>
              </div>
            </div>

            {/* Negotiation Section (Visible only to Admin) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-neutral-500" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Painel de Negociação (Restrito)</h3>
              </div>
              
              <div className="bg-black/40 p-6 rounded-sm border border-white/5 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Cachê Líquido (R$)</label>
                    <input 
                      type="number" 
                      value={proposalData.cache} 
                      onChange={e => setProposalData({...proposalData, cache: e.target.value})}
                      placeholder="0,00"
                      className="w-full bg-neutral-900 border border-white/10 p-3 text-sm focus:outline-none focus:border-white" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Comissão 064 (%)</label>
                    <input 
                      type="number" 
                      value={proposalData.comissao}
                      onChange={e => setProposalData({...proposalData, comissao: e.target.value})}
                      className="w-full bg-neutral-900 border border-white/10 p-3 text-sm focus:outline-none focus:border-white" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Total com Despesas Estimadas (Aéreo/Hospedagem)</label>
                  <input 
                    type="number" 
                    value={proposalData.despesas}
                    onChange={e => setProposalData({...proposalData, despesas: e.target.value})}
                    placeholder="0,00"
                    className="w-full bg-neutral-900 border border-white/10 p-3 text-sm focus:outline-none focus:border-white" 
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => {
                      contractMutation.mutate({
                        booking_id: selectedRequest.id,
                        artist_id: selectedRequest.artist_id,
                        artist_name: getArtistName(selectedRequest.artist_id),
                        contractor_name: selectedRequest.name,
                        event_name: selectedRequest.name, // Fallback to contractor name if not specified
                        event_date: selectedRequest.event_date || new Date().toISOString(),
                        city: "A definir",
                        state: "GO",
                        total_value: Number(proposalData.cache) + Number(proposalData.despesas),
                        payment_conditions: `Cachê: ${proposalData.cache}, Comissão: ${proposalData.comissao}%, Despesas: ${proposalData.despesas}`
                      });
                    }}
                    disabled={contractMutation.isPending}
                    className="flex-1 bg-white text-black py-3 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-200 transition flex items-center justify-center gap-2"
                  >
                    <FileText className="w-3 h-3" /> {contractMutation.isPending ? "Gerando..." : "Gerar Contrato"}
                  </button>
                  <button 
                    onClick={() => statusMutation.mutate({ id: selectedRequest.id, status: 'CONFIRMADA' })}
                    className="flex-1 bg-green-600 text-white py-3 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-green-500 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-3 h-3" /> Fechar Show
                  </button>
                </div>
                
                <button 
                  onClick={() => statusMutation.mutate({ id: selectedRequest.id, status: 'RECUSADA' })}
                  className="w-full bg-transparent border border-red-900/50 text-red-500/50 hover:bg-red-900/20 py-3 text-[10px] font-bold uppercase tracking-widest rounded-sm transition"
                >
                  Recusar Solicitação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
