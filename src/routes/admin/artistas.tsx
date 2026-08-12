import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getActiveArtists, getAllArtists, saveArtist, deleteArtist, Artist } from "@/lib/cms.functions";
import { Search, Plus, Edit2, Trash2, Eye, Copy, Power } from "lucide-react";
import { useState } from "react";
import { ArtistForm } from "@/components/admin/ArtistForm";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/artistas")({
  component: AdminArtists,
});

function AdminArtists() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  
  const { data: artists } = useSuspenseQuery({
    queryKey: ["all-artists"],
    queryFn: () => getAllArtists(),
  });

  const saveMutation = useMutation({
    mutationFn: (data: { artist: Artist, videos: any[], gallery: any[] }) => saveArtist({ data: data.artist }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-artists"] });
      setIsFormOpen(false);
      setEditingArtist(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteArtist({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-artists"] });
      toast.success("Artista excluído");
    }
  });

  if (isFormOpen) {
    return (
      <ArtistForm 
        initialData={editingArtist}
        onSave={async (artist, videos, gallery) => {
          saveMutation.mutate({ artist, videos, gallery });
        }}
        onCancel={() => {
          setIsFormOpen(false);
          setEditingArtist(null);
        }}
      />
    );
  }

  return (
    <div className="p-6 md:p-12 space-y-12 w-full">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase">Artistas</h1>
          <p className="text-neutral-500 text-sm mt-2">Gerencie o casting da 064 Talents.</p>
        </div>
        <button className="w-full md:w-auto bg-white text-black px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Adicionar Artista
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
         <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
            <input 
              type="text" 
              placeholder="Pesquisar artistas..." 
              className="w-full bg-neutral-900/50 border border-white/5 p-4 pl-12 text-sm focus:outline-none focus:border-white/20 transition"
            />
         </div>
         <select className="w-full md:w-auto bg-neutral-900/50 border border-white/5 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-white/20 transition">
            <option>Todos os Gêneros</option>
            <option>Eletrofunk</option>
            <option>House</option>
            <option>Techno</option>
         </select>
      </div>

      <div className="overflow-x-auto border border-white/5 bg-neutral-900/20 w-full">
        <table className="w-full text-left text-sm min-w-[600px]">
          <thead>
            <tr className="bg-neutral-900/50 border-b border-white/5 uppercase text-[10px] tracking-widest text-neutral-500">
              <th className="p-6 font-bold">Artista</th>
              <th className="p-6 font-bold">Gênero</th>
              <th className="p-6 font-bold">Localidade</th>
              <th className="p-6 font-bold">Status</th>
              <th className="p-6 font-bold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {artists?.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-neutral-500 uppercase text-[10px] tracking-widest font-bold">
                  Nenhum artista cadastrado.
                </td>
              </tr>
            ) : (
              artists.map((artist: any, idx: number) => (
                <tr key={idx} className="hover:bg-white/5 transition group">
                  <td className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-800 rounded-sm overflow-hidden border border-white/5 flex-shrink-0">
                      {artist.photo_url ? (
                        <img src={artist.photo_url} alt={artist.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center text-[10px] font-bold text-neutral-600">064</div>
                      )}
                    </div>
                    <span className="font-bold uppercase tracking-tighter text-lg truncate">{artist.name}</span>
                  </td>
                  <td className="p-6 text-neutral-500 text-xs font-bold uppercase tracking-widest">{artist.genre}</td>
                  <td className="p-6 text-neutral-500 text-xs font-bold uppercase tracking-widest">{artist.city}</td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest border border-green-500/20 whitespace-nowrap">
                      {artist.status}
                    </span>
                  </td>
                  <td className="p-6 text-right space-x-4 whitespace-nowrap">
                    <button className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition">Editar</button>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-red-500/50 hover:text-red-500 transition">Excluir</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
        <span>Mostrando {artists?.length || 0} artistas</span>
        <div className="flex gap-2">
          <button className="p-2 border border-white/5 hover:bg-white/5 transition disabled:opacity-50" disabled>Anterior</button>
          <button className="p-2 border border-white/5 hover:bg-white/5 transition disabled:opacity-50" disabled>Próximo</button>
        </div>
      </div>
    </div>
  );
}
