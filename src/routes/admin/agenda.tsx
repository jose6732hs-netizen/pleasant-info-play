import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isWithinInterval, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, User, Info, AlertCircle, LayoutDashboard, Users, Calendar, Briefcase, FileText, Settings, MousePointer2 } from "lucide-react";
import { getActiveArtists } from "@/lib/cms.functions";
import { getArtistCalendar, addCalendarEvent } from "@/lib/booking.functions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logoAsset from "@/assets/logo-completa.png.asset.json";

export const Route = createFileRoute("/admin/agenda")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData({
        queryKey: ["active-artists"],
        queryFn: () => getActiveArtists(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["calendar-events", "1"], // Default to first artist mock
        queryFn: () => getArtistCalendar({ data: { artist_id: "1" } }),
      }),
    ]);
  },
  component: AdminAgenda,
});

function AdminAgenda() {
  const queryClient = useQueryClient();
  const { data: artists } = useSuspenseQuery({
    queryKey: ["active-artists"],
    queryFn: () => getActiveArtists(),
  });

  const [selectedArtistId, setSelectedArtistId] = useState<string>(artists?.[0]?.id || "1");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start_time: "",
    end_time: "",
    city: "",
    state: "",
    location: "",
    contractor: "",
    status: "CONFIRMADO" as any,
    notes: ""
  });

  const { data: events } = useSuspenseQuery({
    queryKey: ["calendar-events", selectedArtistId],
    queryFn: () => getArtistCalendar({ data: { artist_id: selectedArtistId } }),
  });

  const mutation = useMutation({
    mutationFn: addCalendarEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events", selectedArtistId] });
      setIsAddEventOpen(false);
      toast.success("Compromisso adicionado com sucesso.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao adicionar compromisso.");
    }
  });

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMADO': return 'bg-blue-600 text-white';
      case 'PRÉ-RESERVA': return 'bg-amber-500 text-white';
      case 'INDISPONÍVEL': return 'bg-neutral-700 text-neutral-300';
      case 'CANCELADO': return 'bg-red-900/50 text-red-500';
      default: return 'bg-green-600 text-white';
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

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
          <Link to="/admin/agenda" className="p-3 bg-white/10 text-white transition rounded-sm font-bold flex items-center gap-3">
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
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase">Agenda</h1>
              <p className="text-neutral-500 text-sm mt-2">Controle de datas e disponibilidade.</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <select 
                value={selectedArtistId}
                onChange={(e) => setSelectedArtistId(e.target.value)}
                className="bg-neutral-900 border border-white/10 rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-white/30"
              >
                {artists.map((artist: any) => (
                  <option key={artist.id} value={artist.id}>{artist.name}</option>
                ))}
              </select>
              <button 
                onClick={() => setIsAddEventOpen(true)}
                className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full text-xs font-bold uppercase hover:bg-neutral-200 transition whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Novo Evento
              </button>
            </div>
          </header>

          {/* Calendar View */}
          <div className="bg-neutral-900/30 border border-white/5 rounded-sm p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold uppercase tracking-tighter">
                {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth} className="border-white/5 hover:bg-white/5">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth} className="border-white/5 hover:bg-white/5">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 overflow-hidden rounded-sm">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="bg-neutral-950 p-2 text-center text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  {day}
                </div>
              ))}
              {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-neutral-950/20 aspect-square md:aspect-auto md:h-32 p-2"></div>
              ))}
              {days.map(day => {
                const dayEvents = events?.filter(e => isSameDay(parseISO(e.start_time), day));
                return (
                  <div key={day.toString()} className={cn(
                    "bg-neutral-950 aspect-square md:aspect-auto md:h-32 p-2 space-y-2 overflow-y-auto transition hover:bg-white/[0.02]",
                    !isSameMonth(day, currentMonth) && "opacity-20"
                  )}>
                    <span className="text-xs font-bold text-neutral-500">{format(day, 'd')}</span>
                    <div className="space-y-1">
                      {dayEvents?.map(event => (
                        <div key={event.id} className={cn(
                          "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-[2px] truncate cursor-pointer hover:opacity-80 transition",
                          getStatusColor(event.status)
                        )}>
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Legend */}
          <div className="flex flex-wrap gap-6 justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 bg-neutral-900/20 p-4 rounded-sm border border-white/5">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600 rounded-full"></div> Confirmado</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-full"></div> Pré-Reserva</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-neutral-700 rounded-full"></div> Indisponível</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-900/50 rounded-full"></div> Cancelado</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-600 rounded-full"></div> Disponível</div>
          </div>
        </div>
      </main>

      {/* Modal Mockup for Adding Event */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 w-full max-w-lg rounded-sm p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 className="text-2xl font-bold uppercase tracking-tighter">Novo Compromisso</h2>
              <button onClick={() => setIsAddEventOpen(false)} className="text-neutral-500 hover:text-white transition">✕</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Nome do Evento</label>
                <input 
                  type="text" 
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm focus:outline-none focus:border-white/30" 
                  placeholder="Ex: Show Nacional 064" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Início</label>
                <input 
                  type="datetime-local" 
                  value={newEvent.start_time}
                  onChange={(e) => setNewEvent({...newEvent, start_time: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm focus:outline-none focus:border-white/30 color-scheme-dark" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Término</label>
                <input 
                  type="datetime-local" 
                  value={newEvent.end_time}
                  onChange={(e) => setNewEvent({...newEvent, end_time: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm focus:outline-none focus:border-white/30" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Cidade</label>
                <input 
                  type="text" 
                  value={newEvent.city}
                  onChange={(e) => setNewEvent({...newEvent, city: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm focus:outline-none focus:border-white/30" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Estado</label>
                <input 
                  type="text" 
                  value={newEvent.state}
                  onChange={(e) => setNewEvent({...newEvent, state: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm focus:outline-none focus:border-white/30" 
                  placeholder="Ex: GO"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Status</label>
                <select 
                  value={newEvent.status}
                  onChange={(e) => setNewEvent({...newEvent, status: e.target.value as any})}
                  className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm focus:outline-none focus:border-white/30"
                >
                  <option value="CONFIRMADO">CONFIRMADO</option>
                  <option value="PRÉ-RESERVA">PRÉ-RESERVA</option>
                  <option value="INDISPONÍVEL">INDISPONÍVEL</option>
                </select>
              </div>
            </div>

            <Button 
              disabled={mutation.isPending}
              onClick={() => mutation.mutate({ 
                data: {
                  ...newEvent, 
                  artist_id: selectedArtistId,
                  start_time: new Date(newEvent.start_time).toISOString(),
                  end_time: new Date(newEvent.end_time).toISOString()
                }
              })}
              className="w-full bg-white text-black font-bold uppercase tracking-widest hover:bg-neutral-200"
            >
              {mutation.isPending ? "Salvando..." : "Confirmar Compromisso"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
