import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const ContractStatusSchema = z.enum([
  'RASCUNHO', 
  'AGUARDANDO ENVIO', 
  'ENVIADO', 
  'AGUARDANDO ASSINATURA', 
  'ASSINADO', 
  'CANCELADO', 
  'FINALIZADO'
]);

export type ContractStatus = z.infer<typeof ContractStatusSchema>;

export const ContractSchema = z.object({
  id: z.string(),
  booking_id: z.string(),
  contract_number: z.string(),
  artist_name: z.string(),
  contractor_name: z.string(),
  event_name: z.string(),
  event_date: z.string(),
  city: z.string(),
  state: z.string(),
  total_value: z.number(),
  status: ContractStatusSchema,
  created_at: z.string(),
  updated_at: z.string(),
  payment_conditions: z.string(),
  terms: z.object({
    title: z.string(),
    object: z.string(),
    obligations_artist: z.string(),
    obligations_contractor: z.string(),
    cancellation: z.string(),
    additional_clauses: z.string()
  }).optional(),
  internal_notes: z.string().optional()
});

export type Contract = z.infer<typeof ContractSchema>;

export const PaymentStatusSchema = z.enum(['PENDENTE', 'PARCIAL', 'PAGO', 'ATRASADO']);
export const PaymentInstallmentSchema = z.object({
  id: z.string(),
  description: z.string(),
  value: z.number(),
  due_date: z.string(),
  status: PaymentStatusSchema
});

export const BookingHistorySchema = z.object({
  id: z.string(),
  booking_id: z.string(),
  timestamp: z.string(),
  event: z.string(),
  user: z.string()
});

// Mock Data
let mockContracts: Contract[] = [];
let mockInstallments: Record<string, z.infer<typeof PaymentInstallmentSchema>[]> = {};
let mockHistory: Record<string, z.infer<typeof BookingHistorySchema>[]> = {};

export const getContracts = createServerFn({ method: "GET" })
  .handler(async () => {
    return mockContracts;
  });

export const getContractById = createServerFn({ method: "GET" })
  .validator((id: unknown) => z.string().parse(id))
  .handler(async ({ data: id }) => {
    const contract = mockContracts.find(c => c.id === id);
    if (!contract) throw new Error("Contrato não encontrado");
    
    return {
      ...contract,
      installments: mockInstallments[id] || [],
      history: mockHistory[id] || []
    };
  });

export const generateContractFromProposal = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    booking_id: z.string(),
    artist_name: z.string(),
    contractor_name: z.string(),
    event_name: z.string(),
    event_date: z.string(),
    city: z.string(),
    state: z.string(),
    total_value: z.number(),
    payment_conditions: z.string()
  }).parse(data))
  .handler(async ({ data }) => {
    const newContract: Contract = {
      id: `ctr-${Date.now()}`,
      booking_id: data.booking_id,
      contract_number: `2026-${Math.floor(Math.random() * 9000) + 1000}`,
      artist_name: data.artist_name,
      contractor_name: data.contractor_name,
      event_name: data.event_name,
      event_date: data.event_date,
      city: data.city,
      state: data.state,
      total_value: data.total_value,
      status: 'RASCUNHO',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      payment_conditions: data.payment_conditions,
      terms: {
        title: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS ARTÍSTICOS - ${data.artist_name.toUpperCase()}`,
        object: `Apresentação musical do artista ${data.artist_name} no evento ${data.event_name}.`,
        obligations_artist: "Cumprir o horário acordado, realizar a performance com excelência técnica.",
        obligations_contractor: "Fornecer rider técnico, segurança, alimentação e camarim conforme acordado.",
        cancellation: "Multa de 50% em caso de cancelamento por parte do contratante com menos de 30 dias.",
        additional_clauses: ""
      }
    };

    mockContracts.push(newContract);
    
    // Add initial history
    mockHistory[newContract.id] = [{
      id: `hist-${Date.now()}`,
      booking_id: data.booking_id,
      timestamp: new Date().toISOString(),
      event: "Contrato gerado a partir da proposta",
      user: "Sistema"
    }];

    return newContract;
  });

export const updateContract = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    id: z.string(),
    updates: z.any()
  }).parse(data))
  .handler(async ({ data }) => {
    mockContracts = mockContracts.map(c => 
      c.id === data.id ? { ...c, ...data.updates, updated_at: new Date().toISOString() } : c
    );
    
    // Log history if status changed
    if (data.updates.status) {
      const hist = mockHistory[data.id] || [];
      hist.push({
        id: `hist-${Date.now()}`,
        booking_id: mockContracts.find(c => c.id === data.id)?.booking_id || "",
        timestamp: new Date().toISOString(),
        event: `Status alterado para: ${data.updates.status}`,
        user: "Admin"
      });
      mockHistory[data.id] = hist;
    }

    return { success: true };
  });

export const manageInstallments = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    contract_id: z.string(),
    installments: z.array(z.any())
  }).parse(data))
  .handler(async ({ data }) => {
    mockInstallments[data.contract_id] = data.installments;
    return { success: true };
  });

export const addHistoryEntry = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    contract_id: z.string(),
    event: z.string()
  }).parse(data))
  .handler(async ({ data }) => {
    const contract = mockContracts.find(c => c.id === data.contract_id);
    if (!contract) return;
    
    const hist = mockHistory[data.contract_id] || [];
    hist.push({
      id: `hist-${Date.now()}`,
      booking_id: contract.booking_id,
      timestamp: new Date().toISOString(),
      event: data.event,
      user: "Admin"
    });
    mockHistory[data.contract_id] = hist;
    return { success: true };
  });
