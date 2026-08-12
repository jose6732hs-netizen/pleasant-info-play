import { useState } from "react";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitBookingRequest, getActiveArtists } from "@/lib/cms.functions";
import { toast } from "sonner";
import { useSuspenseQuery } from "@tanstack/react-query";
import { captureClick, trackArtistEvent } from "@/lib/analytics-client";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialArtistId?: string | undefined;
}

export function BookingModal({ isOpen, onClose, initialArtistId }: BookingModalProps) {
  const { data: artists } = useSuspenseQuery({
    queryKey: ["active-artists"],
    queryFn: () => getActiveArtists(),
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    artist_id: initialArtistId || "",
    event_date: "",
    message: ""
  });

  const mutation = useMutation({
    mutationFn: submitBookingRequest,
    onSuccess: (data: any) => {
      toast.success(data.message || "Solicitação enviada!");
      onClose();
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    captureClick("Enviar Solicitação de Booking", "booking-submit-btn", { artistId: form.artist_id });
    if (form.artist_id) {
      trackArtistEvent('artist_contact', form.artist_id, { type: 'form_submit' });
    }
    mutation.mutate({ data: form });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-white/10 w-full max-w-lg rounded-sm p-8 space-y-8 relative animate-in fade-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-neutral-500 hover:text-white transition">
          <X className="w-6 h-6" />
        </button>
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter">Solicitar Data</h2>
          <p className="text-neutral-500 text-[10px] uppercase tracking-widest">Preencha os dados abaixo para análise de agenda.</p>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Seu Nome</label>
              <input 
                type="text" 
                required 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                className="w-full bg-black border border-white/10 p-3 text-sm focus:outline-none focus:border-white transition" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">WhatsApp</label>
              <input 
                type="tel" 
                required 
                value={form.whatsapp} 
                onChange={e => setForm({...form, whatsapp: e.target.value})} 
                className="w-full bg-black border border-white/10 p-3 text-sm focus:outline-none focus:border-white transition" 
              />
            </div>
            <div className="col-span-full space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">E-mail</label>
              <input 
                type="email" 
                required 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
                className="w-full bg-black border border-white/10 p-3 text-sm focus:outline-none focus:border-white transition" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Artista</label>
              <select 
                value={form.artist_id} 
                onChange={e => setForm({...form, artist_id: e.target.value})} 
                className="w-full bg-black border border-white/10 p-3 text-sm focus:outline-none focus:border-white transition appearance-none"
              >
                <option value="">Selecione o artista</option>
                {artists?.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Data do Evento</label>
              <input 
                type="date" 
                value={form.event_date} 
                onChange={e => setForm({...form, event_date: e.target.value})} 
                className="w-full bg-black border border-white/10 p-3 text-sm focus:outline-none focus:border-white transition color-scheme-dark" 
              />
            </div>
            <div className="col-span-full space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Mensagem / Local</label>
              <textarea 
                rows={3} 
                value={form.message} 
                onChange={e => setForm({...form, message: e.target.value})} 
                className="w-full bg-black border border-white/10 p-3 text-sm focus:outline-none focus:border-white transition resize-none"
              ></textarea>
            </div>
          </div>
          <button disabled={mutation.isPending} className="w-full bg-white text-black py-4 font-bold uppercase tracking-widest text-xs hover:bg-neutral-200 transition disabled:opacity-50">
            {mutation.isPending ? "Enviando..." : "Enviar Solicitação"}
          </button>
        </form>
      </div>
    </div>
  );
}
