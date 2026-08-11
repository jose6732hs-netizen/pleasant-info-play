# Plan: Contracts, Documents and Closing Flow - 064 TALENTS

Implementation of a professional booking closure module, integrating contracts, digital documents, and financial tracking into the existing administrative dashboard.

## Technical Details

### 1. Database Schema (Conceptual/Mock Persistence)
*   `contracts` table: Linked to `bookings`, status (RASCUNHO to FINALIZADO), payment conditions, terms.
*   `payments` table: Linked to `contracts`, installments, due dates, payment status.
*   `documents` table: Storage references for riders, receipts, and signed contracts.
*   `booking_history` table: Automated timeline events.

### 2. Server Functions (`src/lib/contracts.functions.ts`)
*   `getContracts`: List with filters (Artist, Contractor, Status).
*   `generateContractFromProposal`: Auto-populate from accepted proposals.
*   `updateContractStatus`: Workflow management (Draft -> Sent -> Signed).
*   `manageDocuments`: Upload/Delete logic (using Supabase Storage when enabled).
*   `managePayments`: Track installments and total balance.

### 3. Routes & UI
*   `src/routes/admin/contratos/index.tsx`: Main management table with global search and filters.
*   `src/routes/admin/contratos/$id.tsx`: Detailed view, editor, and timeline.
*   `src/routes/admin/contratos/$id.visualizar.tsx`: Clean, professional print-friendly layout for document review.
*   Integration: "Gerar Contrato" button in `src/routes/admin/solicitacoes.tsx`.

### 4. Logic & Synchronization
*   Automatic Agenda blocking when a contract hits "ASSINADO".
*   Real-time balance calculations for installments.
*   Internal notes field for administrative context.

## User Review Required

> [!IMPORTANT]
> The PDF generation will initially be implemented as a high-fidelity print view (Ctrl+P/Save as PDF) to ensure formatting consistency without requiring external heavy binary libraries in the edge runtime.

*   Are there specific contractual clauses you'd like as defaults in the "Draft" state?
*   Should the "Produção" role see financial data, or should that be restricted to "Admin/Financeiro"?
