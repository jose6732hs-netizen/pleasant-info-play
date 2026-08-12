import React, { useState } from 'react';
import { Artist, ArtistVideo, ArtistGallery } from '@/lib/cms.functions';
import { Save, Image as ImageIcon, Video, Globe, Info, FileText, Search, User, ChevronRight, Check } from 'lucide-react';
import { ArtistProfile } from '@/components/ArtistProfile';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { RichTextEditor } from './RichTextEditor';

interface ArtistFormProps {
  initialData?: Artist | null | undefined;
  initialVideos?: ArtistVideo[];
  initialGallery?: ArtistGallery[];
  onSave: (artist: Artist, videos: ArtistVideo[], gallery: ArtistGallery[]) => Promise<void>;
  onCancel: () => void;
}

export function ArtistForm({ initialData, initialVideos = [], initialGallery = [], onSave, onCancel }: ArtistFormProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [artist, setArtist] = useState<Artist>(initialData || {
    id: '',
    slug: '',
    status: 'ATIVO',
    featured: false,
    display_order: 0,
    created_at: new Date().toISOString(),
    name: '',
    full_name: '',
    main_category: '',
    genre: '',
    sub_genre: '',
    city: '',
    state: '',
    country: 'Brasil',
    photo_url: '',
    hero_url: '',
    hero_title: '',
    subtitle: '',
    caption: '',
    highlight_phrase: '',
    short_bio: '',
    full_bio: '',
    professional_description: '',
    history: '',
    musical_style_info: '',
    differentials: '',
    career_moments: '',
    experience: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    spotify: '',
    deezer: '',
    facebook: '',
    website: '',
    booking_btn_text: 'CONTRATAR ARTISTA',
    booking_call_text: 'Entre em contato agora para consultar disponibilidade e orçamentos.',
    availability: 'NACIONAL / INTERNACIONAL',
    hiring_type: 'CACHE / BILHETERIA / CORPORATIVO',
    service_region: 'TODO O BRASIL',
    accepted_events: 'SHOWS, FESTIVAIS, CORPORATIVOS, EVENTOS PRIVADOS',
    commercial_notes: '',
    seo_title: '',
    seo_description: '',
    og_image: '',
    indexable: true
  });

  const [videos, setVideos] = useState<ArtistVideo[]>(initialVideos);
  const [gallery, setGallery] = useState<ArtistGallery[]>(initialGallery);

  const tabs = [
    { label: "01 — INFORMAÇÕES", icon: User },
    { label: "02 — IMAGENS", icon: ImageIcon },
    { label: "03 — TEXTOS", icon: FileText },
    { label: "04 — VÍDEOS", icon: Video },
    { label: "05 — REDES SOCIAIS", icon: Globe },
    { label: "06 — BOOKING", icon: Info },
    { label: "07 — SEO", icon: Search },
    { label: "08 — PREVIEW", icon: Check },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setArtist(prev => {
      const updated = { ...prev, [name]: val };
      // Auto-generate slug from name if slug is empty
      if (name === 'name' && !prev.slug) {
        updated.slug = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      }
      return updated;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artist.name || !artist.slug) {
      toast.error("Nome e Slug são obrigatórios");
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(artist, videos, gallery);
      toast.success("Artista salvo com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar artista");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <header className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-tighter">
            {initialData ? `Editando: ${initialData.name}` : "Cadastrar Novo Artista"}
          </h2>
          <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mt-1">
            Preencha todos os campos para uma apresentação premium
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 md:flex-none text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition px-6"
          >
            Descartar
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 md:flex-none bg-white text-black px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition flex items-center justify-center gap-2"
          >
            {isSaving ? "Salvando..." : <><Save className="w-3 h-3" /> Salvar Artista</>}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Tabs */}
        <nav className="w-16 md:w-64 border-r border-white/5 flex flex-col bg-neutral-950">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={cn(
                "w-full flex items-center gap-4 p-5 text-left transition relative",
                activeTab === i ? "bg-white/5 text-white" : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.02]"
              )}
            >
              <tab.icon className={cn("w-4 h-4", activeTab === i ? "text-white" : "text-neutral-600")} />
              <span className="hidden md:block text-[9px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
              {activeTab === i && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />}
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-neutral-900/20">
          <div className="max-w-4xl mx-auto p-6 md:p-12">
            {activeTab === 0 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Nome Artístico *</label>
                    <input name="name" value={artist.name} onChange={handleInputChange} type="text" className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition" placeholder="Ex: Vini DJ" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Slug / URL Amigável *</label>
                    <div className="flex items-center gap-2 bg-black border border-white/10 p-4 rounded-sm">
                      <span className="text-neutral-600 text-xs">/artistas/</span>
                      <input name="slug" value={artist.slug} onChange={handleInputChange} type="text" className="bg-transparent focus:outline-none w-full" placeholder="nome-do-artista" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Nome Completo</label>
                    <input name="full_name" value={artist.full_name} onChange={handleInputChange} type="text" className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Categoria Principal</label>
                    <select name="main_category" value={artist.main_category} onChange={handleInputChange} className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition">
                      <option value="">Selecione</option>
                      <option value="DJ">DJ</option>
                      <option value="DUPLA">DUPLA</option>
                      <option value="BANDA">BANDA</option>
                      <option value="SOLO">SOLO</option>
                    </select>
                  </div>
                   <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Gênero Musical</label>
                    <input name="genre" value={artist.genre} onChange={handleInputChange} type="text" className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition" placeholder="Ex: Eletrofunk" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Cidade Base</label>
                    <input name="city" value={artist.city} onChange={handleInputChange} type="text" className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition" />
                  </div>
                </div>

                <div className="p-6 border border-white/5 bg-neutral-950 rounded-sm grid grid-cols-2 gap-6">
                   <div className="flex items-center gap-3">
                      <input name="status" checked={artist.status === 'ATIVO'} onChange={(e) => setArtist({...artist, status: e.target.checked ? 'ATIVO' : 'INATIVO'})} type="checkbox" id="status" className="w-4 h-4 accent-white" />
                      <label htmlFor="status" className="text-[10px] uppercase tracking-widest font-bold">Artista Ativo</label>
                   </div>
                   <div className="flex items-center gap-3">
                      <input name="featured" checked={artist.featured} onChange={(e) => setArtist({...artist, featured: e.target.checked})} type="checkbox" id="featured" className="w-4 h-4 accent-white" />
                      <label htmlFor="featured" className="text-[10px] uppercase tracking-widest font-bold">Em Destaque</label>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Upload de Mídia</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Imagem de Perfil / Card</label>
                          <div className="aspect-[3/4] bg-black border border-white/10 rounded-sm relative group overflow-hidden flex items-center justify-center text-center p-8">
                             {artist.photo_url ? (
                               <img src={artist.photo_url} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                             ) : (
                               <div className="space-y-4">
                                  <ImageIcon className="w-12 h-12 text-neutral-800 mx-auto" />
                                  <p className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest">Arraste a imagem ou clique para upload</p>
                               </div>
                             )}
                             <input 
                              type="text" 
                              placeholder="URL da Imagem (Provisório)" 
                              className="absolute bottom-4 left-4 right-4 bg-black/80 border border-white/10 p-2 text-[8px] focus:outline-none"
                              value={artist.photo_url}
                              onChange={(e) => setArtist({...artist, photo_url: e.target.value})}
                             />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Imagem de Capa (HERO)</label>
                          <div className="aspect-[3/4] bg-black border border-white/10 rounded-sm relative group overflow-hidden flex items-center justify-center text-center p-8">
                            {artist.hero_url ? (
                               <img src={artist.hero_url} className="absolute inset-0 w-full h-full object-cover" alt="Preview Hero" />
                             ) : (
                               <div className="space-y-4">
                                  <ImageIcon className="w-12 h-12 text-neutral-800 mx-auto" />
                                  <p className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest">Capa para página individual</p>
                               </div>
                             )}
                              <input 
                              type="text" 
                              placeholder="URL da Capa (Provisório)" 
                              className="absolute bottom-4 left-4 right-4 bg-black/80 border border-white/10 p-2 text-[8px] focus:outline-none"
                              value={artist.hero_url}
                              onChange={(e) => setArtist({...artist, hero_url: e.target.value})}
                             />
                          </div>
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Galeria de Fotos (URLs separadas por vírgula)</label>
                      <textarea 
                        className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition resize-none h-32"
                        placeholder="https://exemplo.com/foto1.jpg, https://exemplo.com/foto2.jpg"
                        value={gallery.map(g => g.image_url).join(', ')}
                        onChange={(e) => {
                          const urls = e.target.value.split(',').map(u => u.trim()).filter(Boolean);
                          setGallery(urls.map((url, i) => ({
                            id: `gal-${i}`,
                            artist_id: artist.id,
                            image_url: url,
                            order: i
                          })));
                        }}
                      />
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                 <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Título Principal da Página</label>
                      <input name="hero_title" value={artist.hero_title} onChange={handleInputChange} type="text" className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition" placeholder="Ex: VINI DJ — O SOM DO FUTURO" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Frase de Destaque</label>
                      <textarea name="highlight_phrase" value={artist.highlight_phrase} onChange={handleInputChange} rows={2} className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition resize-none"></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Bio Curta (Highlight)</label>
                      <textarea name="short_bio" value={artist.short_bio} onChange={handleInputChange} rows={3} className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition resize-none"></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Biografia Completa</label>
                      <textarea name="full_bio" value={artist.full_bio} onChange={handleInputChange} rows={8} className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition resize-none"></textarea>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                 <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Vídeos (YouTube/Vimeo)</h3>
                    <div className="space-y-4">
                      {videos.map((video, idx) => (
                        <div key={video.id || idx} className="p-6 bg-black border border-white/10 rounded-sm space-y-4">
                          <input 
                            placeholder="Título do Vídeo" 
                            className="w-full bg-neutral-900 border border-white/5 p-3 text-xs"
                            value={video.title}
                            onChange={(e) => {
                              const newVideos = [...videos];
                              if (newVideos[idx]) {
                                newVideos[idx] = { ...newVideos[idx], title: e.target.value };
                                setVideos(newVideos);
                              }
                            }}
                          />
                          <input 
                            placeholder="URL do Vídeo" 
                            className="w-full bg-neutral-900 border border-white/5 p-3 text-xs"
                            value={video.url}
                            onChange={(e) => {
                              const newVideos = [...videos];
                              if (newVideos[idx]) {
                                newVideos[idx] = { ...newVideos[idx], url: e.target.value };
                                setVideos(newVideos);
                              }
                            }}
                          />
                        </div>
                      ))}
                      <button 
                        type="button"
                        onClick={() => setVideos([...videos, { id: `vid-${Date.now()}`, artist_id: artist.id, title: '', url: '', order: videos.length, status: 'ATIVO' }])}
                        className="w-full border border-dashed border-white/20 p-4 text-[9px] font-bold uppercase tracking-widest hover:border-white transition"
                      >
                        + Adicionar Vídeo
                      </button>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['instagram', 'youtube', 'tiktok', 'spotify', 'deezer', 'facebook', 'website'].map((social) => (
                    <div key={social} className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold capitalize">{social}</label>
                      <input 
                        name={social} 
                        value={(artist as any)[social] || ''} 
                        onChange={handleInputChange} 
                        type="text" 
                        className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition" 
                        placeholder={`URL do ${social}`} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 5 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Texto do Botão</label>
                    <input name="booking_btn_text" value={artist.booking_btn_text} onChange={handleInputChange} type="text" className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Chamada para Booking</label>
                    <input name="booking_call_text" value={artist.booking_call_text} onChange={handleInputChange} type="text" className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Disponibilidade</label>
                    <input name="availability" value={artist.availability} onChange={handleInputChange} type="text" className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Tipos de Contratação</label>
                    <input name="hiring_type" value={artist.hiring_type} onChange={handleInputChange} type="text" className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 6 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">SEO Title</label>
                    <input name="seo_title" value={artist.seo_title} onChange={handleInputChange} type="text" className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">SEO Description</label>
                    <textarea name="seo_description" value={artist.seo_description} onChange={handleInputChange} rows={4} className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition resize-none"></textarea>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 7 && (
              <div className="w-full h-full min-h-[800px] border border-white/10 rounded-sm overflow-hidden scale-[0.85] origin-top">
                <ArtistProfile artist={artist} videos={videos} gallery={gallery} isPreview />
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}
