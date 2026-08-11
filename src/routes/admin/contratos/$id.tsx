import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getContractById, updateContract, manageInstallments, addHistoryEntry } from "@/lib/contracts.functions";
import { getActiveArtists } from "@/lib/cms.functions";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";
import { 
  FileText, 
  ChevronLeft, 
  Save, 
  Printer, 
  Send, 
  Clock, 
  CreditCard, 
  History, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Paperclip,
  Trash2
} from "lucide-react";

export const Route = createFileRoute("/admin/contratos/$id")({
  loader: async ({ params, context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData({
        queryKey: ["contract", params.id],
        queryFn: () => getContractById({ data: params.id }),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["active-artists"],
        queryFn: () => getActiveArtists(),
      })
    ]);
  },
  component: ContractDetails,
});

function ContractDetails() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("editor");

  const { data: contract } = useSuspenseQuery({
    queryKey: ["contract", id],
    queryFn: () => getContractById({ data: id }),
  });

  const { data: artists } = useSuspenseQuery({
    queryKey: ["active-artists"],
    queryFn: () => getActiveArtists(),
  });

  const [editData, setEditData] = useState<any>(contract);

  const saveMutation = useMutation({
    mutationFn: (updates: any) => updateContract({ data: { id, updates } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contract", id] });
      toast.success("Alterações salvas!");
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RASCUNHO': return 'text-neutral-400';
      case 'AGUARDANDO ENVIO': return 'text-yellow-400';
      case 'ENVIADO': return 'text-blue-400';
      case 'ASSINADO': return 'text-green-400';
      case 'CANCELADO': return 'text-red-400';
      default: return 'text-white';
    }
  };

  const handleStatusChange = (newStatus: string) => {
    saveMutation.mutate({ status: newStatus });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-white/5 bg-black/40 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin/contratos" className="text-neutral-500 hover:text-white transition">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div>
              <div className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest flex items-center gap-2">
                Contrato #{contract.contract_number} 
                <span className={`w-2 h-2 rounded-full bg-current ${getStatusColor(contract.status)}`} />
              </div>
              <h1 className="text-xl font-bold tracking-tighter uppercase">{contract.artist_name} — {contract.event_name}</h1>
            </div>
          </div>

          <div className="flex gap-3">
            <Link 
              to="/admin/contratos/$id/visualizar" 
              params={{ id }}
              className="px-4 py-2 bg-neutral-900 hover:bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition flex items-center gap-2"
            >
              <Printer className="w-3 h-3" /> Visualizar
            </Link>
            <button 
              onClick={() => handleStatusChange('ENVIADO')}
              className="px-4 py-2 bg-neutral-900 hover:bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition flex items-center gap-2 text-blue-400"
            >
              <Send className="w-3 h-3" /> Enviar
            </button>
            <button 
              onClick={() => saveMutation.mutate(editData)}
              className="px-6 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-200 transition flex items-center gap-2"
            >
              <Save className="w-3 h-3" /> Salvar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="flex gap-1 bg-neutral-900 p-1 rounded-sm border border-white/5 mb-12 w-fit">
          {[
            { id: 'editor', label: 'Editor', icon: FileText },
            { id: 'financeiro', label: 'Financeiro', icon: CreditCard },
            { id: 'documentos', label: 'Documentos', icon: Paperclip },
            { id: 'historico', label: 'Histórico', icon: History }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition rounded-sm ${activeTab === tab.id ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
            >
              <tab.icon className="w-3 h-3" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {activeTab === 'editor' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <section className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500 border-b border-white/5 pb-2">Informações Gerais</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-neutral-600 tracking-widest">Artista</label>
                      <select 
                        value={editData.artist_id}
                        onChange={(e) => setEditData({...editData, artist_id: e.target.value, artist_name: artists.find(a => a.id === e.target.value)?.name || ""})}
                        className="w-full bg-neutral-900 border border-white/10 p-4 text-sm focus:outline-none focus:border-white/30 transition"
                      >
                        {artists.map(artist => (
                          <option key={artist.id} value={artist.id}>{artist.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-neutral-600 tracking-widest">Contratante</label>
                      <input 
                        type="text"
                        value={editData.contractor_name}
                        onChange={(e) => setEditData({...editData, contractor_name: e.target.value})}
                        className="w-full bg-neutral-900 border border-white/10 p-4 text-sm focus:outline-none focus:border-white/30 transition"
                      />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500 border-b border-white/5 pb-2 mt-8">Cláusulas do Contrato</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-neutral-600 tracking-widest">Objeto do Contrato</label>
                      <textarea 
                        value={editData.terms?.object}
                        onChange={(e) => setEditData({...editData, terms: { ...editData.terms!, object: e.target.value }})}
                        rows={3}
                        className="w-full bg-neutral-900 border border-white/10 p-4 text-sm focus:outline-none focus:border-white/30 transition resize-none"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-neutral-600 tracking-widest">Obrigações do Artista</label>
                        <textarea 
                          value={editData.terms?.obligations_artist}
                          onChange={(e) => setEditData({...editData, terms: { ...editData.terms!, obligations_artist: e.target.value }})}
                          rows={6}
                          className="w-full bg-neutral-900 border border-white/10 p-4 text-sm focus:outline-none focus:border-white/30 transition resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-neutral-600 tracking-widest">Obrigações do Contratante</label>
                        <textarea 
                          value={editData.terms?.obligations_contractor}
                          onChange={(e) => setEditData({...editData, terms: { ...editData.terms!, obligations_contractor: e.target.value }})}
                          rows={6}
                          className="w-full bg-neutral-900 border border-white/10 p-4 text-sm focus:outline-none focus:border-white/30 transition resize-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-neutral-600 tracking-widest">Política de Cancelamento</label>
                      <textarea 
                        value={editData.terms?.cancellation}
                        onChange={(e) => setEditData({...editData, terms: { ...editData.terms!, cancellation: e.target.value }})}
                        rows={3}
                        className="w-full bg-neutral-900 border border-white/10 p-4 text-sm focus:outline-none focus:border-white/30 transition resize-none"
                      />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'financeiro' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <section className="bg-neutral-900 border border-white/5 p-8 rounded-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest">Cronograma de Pagamento</h3>
                    <button className="text-[9px] font-bold uppercase tracking-widest border border-white/10 px-4 py-2 hover:bg-white/5 transition rounded-sm">
                      + Adicionar Parcela
                    </button>
                  </div>

                  <div className="space-y-4">
                    {contract.installments?.length > 0 ? (
                      contract.installments.map((inst: any) => (
                        <div key={inst.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-sm">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-neutral-800 rounded-sm flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-neutral-500" />
                              </div>
                              <div>
                                <div className="font-bold">{inst.description}</div>
                                <div className="text-[10px] text-neutral-500 uppercase tracking-widest">Vencimento: {format(parseISO(inst.due_date), "dd/MM/yyyy")}</div>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inst.value)}</div>
                              <div className={`text-[9px] font-bold uppercase tracking-widest ${inst.status === 'PAGO' ? 'text-green-500' : 'text-yellow-500'}`}>{inst.status}</div>
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-neutral-600 text-[10px] uppercase tracking-widest">
                        Nenhuma parcela cadastrada.
                      </div>
                    )}
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Total Recebido</div>
                      <div className="text-2xl font-black text-green-500">R$ 0,00</div>
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Saldo Restante</div>
                      <div className="text-2xl font-black">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contract.total_value)}</div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'historico' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
                  {contract.history?.map((entry: any) => (
                    <div key={entry.id} className="relative group">
                      <div className="absolute -left-[28px] top-1.5 w-[16px] h-[16px] bg-neutral-900 border-2 border-white/20 rounded-full group-hover:border-white transition" />
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">{format(parseISO(entry.timestamp), "dd/MM — HH:mm")}</div>
                        <div className="font-bold text-neutral-200">{entry.event}</div>
                        <div className="text-[9px] uppercase font-bold text-neutral-600 tracking-widest">Executado por: {entry.user}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-8">
            <section className="bg-neutral-900 border border-white/5 p-6 rounded-sm space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Resumo da Contratação</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Contratante</span>
                  <span className="font-bold">{contract.contractor_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Local</span>
                  <span className="font-bold">{contract.city}, {contract.state}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Data</span>
                  <span className="font-bold">{format(parseISO(contract.event_date), "dd/MM/yyyy")}</span>
                </div>
                <div className="flex justify-between text-sm pt-4 border-t border-white/5">
                  <span className="text-neutral-500">Valor Total</span>
                  <span className="text-lg font-black">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contract.total_value)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-neutral-600 tracking-widest">Notas Internas</label>
                <textarea 
                  value={editData.internal_notes || ""}
                  onChange={(e) => setEditData({...editData, internal_notes: e.target.value})}
                  rows={4}
                  className="w-full bg-black border border-white/10 p-3 text-sm focus:outline-none focus:border-white/30 transition resize-none"
                  placeholder="Observações visíveis apenas para a equipe..."
                />
              </div>
            </section>

            <section className="bg-neutral-900 border border-white/5 p-6 rounded-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Ações de Status</h3>
              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={() => handleStatusChange('ASSINADO')}
                  className="w-full py-2 bg-green-950/30 text-green-500 border border-green-900/30 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-green-950/50 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-3 h-3" /> Confirmar Assinatura
                </button>
                <button 
                  onClick={() => handleStatusChange('CANCELADO')}
                  className="w-full py-2 bg-red-950/30 text-red-500 border border-red-900/30 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-red-950/50 transition flex items-center justify-center gap-2"
                >
                  <XCircle className="w-3 h-3" /> Cancelar Contrato
                </button>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
