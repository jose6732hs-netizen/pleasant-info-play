import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getContractById } from "@/lib/contracts.functions";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Printer, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/admin/contratos/$id/visualizar")({
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["contract", params.id],
      queryFn: () => getContractById({ data: params.id }),
    });
  },
  component: VisualizarContrato,
});

function VisualizarContrato() {
  const { id } = Route.useParams();
  const { data: contract } = useSuspenseQuery({
    queryKey: ["contract", id],
    queryFn: () => getContractById({ data: id }),
  });

  return (
    <div className="min-h-screen bg-neutral-100 py-12 px-6 print:p-0 print:bg-white">
      {/* UI Controls - Hidden on print */}
      <div className="max-w-[21cm] mx-auto mb-8 flex justify-between items-center print:hidden">
        <Link to="/admin/contratos/$id" params={{ id }} className="text-neutral-500 hover:text-black transition flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
          <ChevronLeft className="w-4 h-4" /> Voltar ao Editor
        </Link>
        <button 
          onClick={() => window.print()}
          className="bg-black text-white px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition flex items-center gap-2"
        >
          <Printer className="w-4 h-4" /> Imprimir / PDF
        </button>
      </div>

      {/* Contract Document */}
      <div className="max-w-[21cm] mx-auto bg-white shadow-2xl p-[2cm] text-black font-serif print:shadow-none print:w-full min-h-[29.7cm]">
        <header className="flex justify-between items-start mb-16 border-b-2 border-black pb-8">
          <div>
            <div className="text-3xl font-black font-sans tracking-tighter mb-1">064 TALENTS</div>
            <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-neutral-500">Agenciamento e Produção Artística</div>
          </div>
          <div className="text-right font-sans">
            <div className="text-lg font-bold">CONTRATO Nº {contract?.contract_number || '---'}</div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-widest">Emitido em {contract?.created_at ? format(parseISO(contract.created_at), "dd/MM/yyyy") : '---'}</div>
          </div>
        </header>

        <h1 className="text-2xl font-bold text-center uppercase mb-12 underline">{contract?.terms?.title || 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS'}</h1>

        <div className="space-y-8 text-justify leading-relaxed text-sm">
          <section>
            <h2 className="font-bold uppercase mb-2">1. DAS PARTES</h2>
            <p>
              De um lado, <strong>064 TALENTS</strong>, doravante denominada simplesmente AGÊNCIA, 
              e de outro lado, <strong>{contract?.contractor_name || '---'}</strong>, doravante denominado simplesmente CONTRATANTE, 
              têm entre si justo e contratado o que segue nas cláusulas abaixo.
            </p>
          </section>

          <section>
            <h2 className="font-bold uppercase mb-2">2. DO OBJETO</h2>
            <p>{contract.terms?.object}</p>
          </section>

          <section>
            <h2 className="font-bold uppercase mb-2">3. DA DATA E LOCAL</h2>
            <p>
              A apresentação ocorrerá no dia <strong>{format(parseISO(contract.event_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</strong>, 
              na cidade de <strong>{contract.city} - {contract.state}</strong>, no local denominado <strong>{contract.event_name}</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-bold uppercase mb-2">4. DO VALOR E FORMA DE PAGAMENTO</h2>
            <p>
              Pela prestação dos serviços objeto deste contrato, o CONTRATANTE pagará à AGÊNCIA o valor total de 
              <strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contract.total_value)}</strong>.
            </p>
            <p className="mt-2 italic whitespace-pre-wrap">{contract.payment_conditions}</p>
          </section>

          <section>
            <h2 className="font-bold uppercase mb-2">5. DAS OBRIGAÇÕES DO ARTISTA</h2>
            <p className="whitespace-pre-wrap">{contract.terms?.obligations_artist}</p>
          </section>

          <section>
            <h2 className="font-bold uppercase mb-2">6. DAS OBRIGAÇÕES DO CONTRATANTE</h2>
            <p className="whitespace-pre-wrap">{contract.terms?.obligations_contractor}</p>
          </section>

          <section>
            <h2 className="font-bold uppercase mb-2">7. DO CANCELAMENTO</h2>
            <p className="whitespace-pre-wrap">{contract.terms?.cancellation}</p>
          </section>

          <section className="pt-24 grid grid-cols-2 gap-20 text-center font-sans">
            <div className="border-t border-black pt-4">
              <div className="text-[10px] uppercase font-bold">064 TALENTS</div>
              <div className="text-[9px] text-neutral-500">Agência Responsável</div>
            </div>
            <div className="border-t border-black pt-4">
              <div className="text-[10px] uppercase font-bold">{contract.contractor_name}</div>
              <div className="text-[9px] text-neutral-500">Contratante</div>
            </div>
          </section>
        </div>

        <footer className="mt-20 pt-8 border-t border-neutral-100 text-[8px] text-neutral-400 font-sans text-center uppercase tracking-[0.2em]">
          Documento gerado eletronicamente via Plataforma 064 Talents • Todos os direitos reservados
        </footer>
      </div>
    </div>
  );
}
