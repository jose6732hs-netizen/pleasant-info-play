import React, { useState, useEffect } from 'react';
import { createFileRoute, Link, useParams, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPageSections, saveSection, PageSection } from '@/lib/cms.functions';
import { 
  ChevronLeft, 
  Save, 
  Eye, 
  Monitor, 
  Smartphone, 
  Tablet,
  CheckCircle2,
  AlertCircle,
  Undo2,
  Settings,
  X,
  Plus,
  Layers,
  Search,
  Maximize2,
  RefreshCw,
  Image as ImageIcon,
  Video,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ImageEditor } from '@/components/admin/ImageEditor';
import { VideoEditor } from '@/components/admin/VideoEditor';
import { SectionStyleEditor, SectionStyles } from '@/components/admin/SectionStyleEditor';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


export const Route = createFileRoute('/admin/editor/$pageId/edit/$sectionId')({
  component: VisualEditor,
});

type ViewMode = 'desktop' | 'tablet' | 'mobile';

function VisualEditor() {
  const { pageId, sectionId } = useParams({ from: '/admin/editor/$pageId/edit/$sectionId' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Local state for the section content being edited
  const [editContent, setEditContent] = useState<any>(null);
  const [editStyles, setEditStyles] = useState<SectionStyles | null>(null);

  const { data: sections, isLoading } = useQuery({
    queryKey: ['sections', pageId],
    queryFn: () => getPageSections({ data: pageId }),
  });

  const section = sections?.find(s => s.id === sectionId);

  useEffect(() => {
    if (section && !editContent) {
      setEditContent(JSON.parse(JSON.stringify(section.content)));
      setEditStyles(section.styles || {
        paddingTop: 80,
        paddingBottom: 80,
        contentWidth: 'normal',
        alignment: 'left',
        backgroundType: 'color',
        backgroundColor: 'black',
        backgroundOverlay: false,
        overlayOpacity: 40,
        sectionHeight: 'auto',
        isVisible: true
      });
    }
  }, [section]);

  const saveMutation = useMutation({
    mutationFn: (updatedSection: PageSection) => saveSection({ data: updatedSection }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections', pageId] });
      setIsSaving(false);
      setHasChanges(false);
      toast.success("Alterações salvas com sucesso");
    },
    onError: () => {
      setIsSaving(false);
      toast.error("Erro ao salvar alterações");
    }
  });

  const handleSave = (publish = false) => {
    if (!section || !editContent) return;
    
    setIsSaving(true);
    const updatedSection: PageSection = {
      ...section,
      content: editContent,
      styles: editStyles,
      status: publish ? 'ATIVA' : section.status
    };
    
    saveMutation.mutate(updatedSection);
  };

  const updateField = (key: string, value: string) => {
    setEditContent((prev: any) => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const restoreOriginal = () => {
    if (!section) return;
    if (confirm("Deseja restaurar o conteúdo e estilos originais da seção? Todas as alterações não salvas serão perdidas.")) {
      setEditContent(JSON.parse(JSON.stringify(section.content)));
      setEditStyles(section.styles || null);
      setHasChanges(false);
      toast.info("Configurações originais restauradas");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white p-8 text-center">
        <div className="max-w-md space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold uppercase tracking-tight">Seção não encontrada</h2>
          <p className="text-neutral-400 text-sm">
            Não foi possível localizar a seção "{sectionId}" na página "{pageId}". 
            Isso pode ocorrer se a seção foi excluída ou se o link expirou.
          </p>
          <Link 
            to="/admin/editor/$pageId" 
            params={{ pageId }}
            className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-sm transition text-xs font-bold uppercase tracking-widest border border-white/10"
          >
            Voltar para a página
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden animate-in fade-in duration-500">
      {/* Top Bar */}
      <header className="h-16 border-b border-white/5 bg-black flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/editor/$pageId"
            params={{ pageId }}
            className="p-2 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white rounded-sm transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">{section.name}</h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Editor Visual</span>
              {hasChanges && (
                <span className="text-[10px] text-blue-400 uppercase tracking-widest font-bold flex items-center gap-1">
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
                  Alterações não salvas
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center bg-white/5 rounded-sm p-1">
          <button 
            onClick={() => setViewMode('desktop')}
            className={`p-2 rounded-sm transition ${viewMode === 'desktop' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('tablet')}
            className={`p-2 rounded-sm transition ${viewMode === 'tablet' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('mobile')}
            className={`p-2 rounded-sm transition ${viewMode === 'mobile' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleSave(false)}
            disabled={!hasChanges || isSaving}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-sm transition text-[10px] font-bold uppercase tracking-widest border border-white/10"
          >
            {isSaving ? "SALVANDO..." : "SALVAR RASCUNHO"}
          </button>
          <button 
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-sm transition text-[10px] font-bold uppercase tracking-widest"
          >
            SALVAR E PUBLICAR
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Properties */}
        <aside className={`
          fixed md:relative z-50 h-[calc(100vh-64px)] w-80 border-r border-white/5 bg-black 
          transition-transform duration-300 ease-in-out
          ${false ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col overflow-y-auto custom-scrollbar
        `}>

          <div className="p-6 border-b border-white/5">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Settings className="w-3 h-3" /> Propriedades da Seção
            </h3>
            
            <div className="space-y-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="texts" className="border-white/5">
                  <AccordionTrigger className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 py-4 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Settings className="w-3 h-3" /> Textos & Conteúdo
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-2 pb-4">
                    {editContent && Object.keys(editContent).filter(key => 
                      typeof editContent[key] === 'string' && 
                      !editContent[key].match(/\.(jpg|jpeg|png|webp|mp4|mov|webm)$/i) &&
                      !editContent[key].includes('youtube.com') &&
                      !editContent[key].includes('vimeo.com') &&
                      !key.toLowerCase().includes('url') &&
                      !key.toLowerCase().includes('image') &&
                      !key.toLowerCase().includes('video')
                    ).map((key) => (
                      <RichTextEditor 
                        key={key}
                        label={key.replace(/_/g, ' ')}
                        value={editContent[key]}
                        onChange={(val) => updateField(key, val)}
                        type={key.includes('title') ? 'title' : key.includes('button') ? 'button' : 'body'}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="media" className="border-white/5">
                  <AccordionTrigger className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 py-4 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-3 h-3" /> Imagens & Banners
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-2 pb-4">
                    {editContent && Object.keys(editContent).filter(key => 
                      key.toLowerCase().includes('image') || 
                      key.toLowerCase().includes('photo') || 
                      key.toLowerCase().includes('banner') || 
                      key.toLowerCase().includes('url')
                    ).map((key) => {
                      // Skip if it's explicitly a video field or content
                      const value = editContent[key];
                      const isVideo = typeof value === 'string' && 
                        (value.match(/\.(mp4|mov|webm)$/i) || value.includes('youtube.com') || value.includes('vimeo.com'));
                      
                      if (isVideo && key.toLowerCase().includes('video')) return null;

                      return (
                        <ImageEditor
                          key={key}
                          label={key.replace(/_/g, ' ')}
                          value={{
                            url: typeof value === 'string' ? value : '',
                            alt: '',
                            position: 'center',
                            objectFit: 'cover',
                            overlay: editStyles?.backgroundOverlay || false,
                            overlayOpacity: editStyles?.overlayOpacity || 0,
                            isBackground: key.toLowerCase().includes('banner') || key.toLowerCase().includes('bg') || key.toLowerCase().includes('background')
                          }}
                          onChange={(img) => updateField(key, img.url)}
                        />
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="video" className="border-white/5">
                  <AccordionTrigger className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 py-4 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Video className="w-3 h-3" /> Vídeos & Backgrounds
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-2 pb-4">
                    {editContent && Object.keys(editContent).filter(key => 
                      key.toLowerCase().includes('video') || 
                      (typeof editContent[key] === 'string' && editContent[key].match(/\.(mp4|mov|webm)$/i)) ||
                      (typeof editContent[key] === 'string' && (editContent[key].includes('youtube.com') || editContent[key].includes('vimeo.com')))
                    ).map((key) => (
                      <VideoEditor
                        key={key}
                        label={key.replace(/_/g, ' ')}
                        value={{
                          id: key,
                          title: '',
                          url: editContent[key] || '',
                          source: editContent[key]?.includes('youtube') ? 'youtube' : editContent[key]?.includes('vimeo') ? 'vimeo' : 'direct',
                          autoplay: true,
                          loop: true,
                          controls: false,
                          muted: true,
                          lazy: true,
                          isPrimary: true
                        }}
                        onChange={(v) => updateField(key, v.url)}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={restoreOriginal}
                  className="w-full py-3 bg-white/5 hover:bg-red-500/10 text-neutral-500 hover:text-red-400 border border-white/5 hover:border-red-500/20 rounded-sm transition text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3 h-3" />
                  Restaurar Original
                </button>
              </div>
            </div>

          </div>
          
          <div className="p-6">
             <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Layers className="w-3 h-3" /> Estilo & Layout
            </h3>
            {editStyles && (
              <SectionStyleEditor 
                value={editStyles} 
                onChange={(styles) => {
                  setEditStyles(styles);
                  setHasChanges(true);
                }}
              />
            )}
          </div>
        </aside>

        {/* Center: Preview Canvas */}
        <main className="flex-1 bg-neutral-900/50 p-8 overflow-y-auto custom-scrollbar flex flex-col items-center">
          <div className={`
            bg-black shadow-2xl transition-all duration-300 border border-white/5 overflow-hidden
            ${viewMode === 'desktop' ? 'w-full max-w-6xl aspect-video' : ''}
            ${viewMode === 'tablet' ? 'w-[768px] h-[1024px]' : ''}
            ${viewMode === 'mobile' ? 'w-[375px] h-[667px]' : ''}
          `}>
            {/* The actual preview would render the section component with editContent */}
            <div className="w-full h-full flex flex-col">
              <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
                <div className="flex-1 text-[10px] text-neutral-500 text-center font-mono truncate px-4">
                  064talents.com.br/{section.page_id}/{section.type}
                </div>
              </div>
              <div className="flex-1 relative overflow-y-auto custom-scrollbar p-12 flex items-center justify-center text-center">
                 <div className="max-w-2xl space-y-6">
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-[0.3em]">Preview Modo {viewMode}</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
                      {editContent?.title || editContent?.name || section.name}
                    </h1>
                    <p className="text-lg text-neutral-400 leading-relaxed">
                      {editContent?.description || editContent?.text || "Visualize suas alterações em tempo real nesta área de pré-visualização."}
                    </p>
                    {editContent?.subtitle && (
                      <p className="text-sm text-neutral-500 uppercase tracking-widest">
                        {editContent.subtitle}
                      </p>
                    )}
                    <div className="pt-8">
                       <button className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-sm">
                          {editContent?.button_text || "AÇÃO PRINCIPAL"}
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar: Quick Options */}
        <aside className="w-16 border-l border-white/5 bg-black flex flex-col items-center py-6 gap-6">
          <button className="p-3 text-neutral-500 hover:text-white transition rounded-sm hover:bg-white/5" title="Pesquisar">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-3 text-neutral-500 hover:text-white transition rounded-sm hover:bg-white/5" title="Novo Elemento">
            <Plus className="w-5 h-5" />
          </button>
          <button className="p-3 text-neutral-500 hover:text-white transition rounded-sm hover:bg-white/5" title="Histórico">
            <Undo2 className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <button className="p-3 text-neutral-500 hover:text-white transition rounded-sm hover:bg-white/5" title="Tela Cheia">
            <Maximize2 className="w-5 h-5" />
          </button>
        </aside>
      </div>
    </div>
  );
}