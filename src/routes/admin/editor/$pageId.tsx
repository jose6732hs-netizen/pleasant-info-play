import React, { useState } from 'react';
import { createFileRoute, Link, useParams, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPageSections, updateSectionsOrder, deleteSection, saveSection, getPages, savePageConfig, publishPage, PageSection } from '@/lib/cms.functions';
import { 
  ChevronLeft, 
  GripVertical, 
  Edit2, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  Plus,
  Save,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle2,
  AlertCircle,
  FileCode,
  LayoutTemplate,
  Palette,
  Rocket
} from 'lucide-react';
import { ArtistsPageEditor } from '@/components/admin/ArtistsPageEditor';
import { ArtistTemplateEditor } from '@/components/admin/ArtistTemplateEditor';
import { GlobalNavEditor } from '@/components/admin/GlobalNavEditor';
import { GlobalDesignEditor } from '@/components/admin/GlobalDesignEditor';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/editor/$pageId')({
  component: PageEditor,
});

interface SortableItemProps {
  section: PageSection;
  onEdit: (id: string) => void;
  onDuplicate: (section: PageSection) => void;
  onToggleStatus: (section: PageSection) => void;
  onDelete: (id: string) => void;
}

function SortableSectionItem({ section, onEdit, onDuplicate, onToggleStatus, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group bg-white/5 border rounded-sm p-4 transition-all relative
        ${isDragging ? 'border-blue-500 shadow-2xl scale-[1.02] bg-white/10' : 'border-white/5 hover:border-white/10'}
        flex items-center gap-4
      `}
    >
      <button 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-neutral-600 hover:text-white transition"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h4 className="font-bold text-white truncate">{section.name}</h4>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
            section.status === 'ATIVA' ? 'bg-green-500/10 text-green-500' : 'bg-neutral-500/10 text-neutral-500'
          }`}>
            {section.status}
          </span>
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest">
            {section.type}
          </span>
        </div>
        <div className="h-12 w-full bg-black/40 rounded-sm overflow-hidden flex items-center justify-center border border-white/5">
           <span className="text-[10px] text-neutral-600 italic">Preview da seção: {section.type}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit(section.id);
          }}
          className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-sm transition cursor-pointer shadow-lg"
          title="Editar Conteúdo"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDuplicate(section)}
          className="p-2 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white rounded-sm transition"
          title="Duplicar"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onToggleStatus(section)}
          className="p-2 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white rounded-sm transition"
          title={section.status === 'ATIVA' ? 'Ocultar' : 'Ativar'}
        >
          {section.status === 'ATIVA' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        <button 
          onClick={() => onDelete(section.id)}
          className="p-2 bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 rounded-sm transition"
          title="Excluir"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function PageEditor() {
  const { pageId } = useParams({ from: '/admin/editor/$pageId' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { data: page } = useQuery({
    queryKey: ['page', pageId],
    queryFn: async () => {
        const pages = await getPages();
        return pages.find(p => p.id === pageId);
    },
  });

  const { data: sections, isLoading } = useQuery({
    queryKey: ['sections', pageId],
    queryFn: () => getPageSections({ data: pageId }),
  });

  const updateOrderMutation = useMutation({
    mutationFn: (newOrder: { id: string, display_order: number }[]) => updateSectionsOrder({ data: newOrder }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections', pageId] });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    },
    onError: () => setSaveStatus('error')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSection({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections', pageId] });
      toast.success("Seção excluída com sucesso");
    }
  });

  const saveSectionMutation = useMutation({
    mutationFn: (section: PageSection) => saveSection({ data: section }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections', pageId] });
    }
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!sections || !over) return;

    if (active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      const newSections = arrayMove(sections, oldIndex, newIndex);
      
      setSaveStatus('saving');
      updateOrderMutation.mutate(
        newSections.map((s, index) => ({ id: s.id, display_order: index }))
      );
    }
  }

  const handleDuplicate = (section: PageSection) => {
    const newSection = {
      ...section,
      id: `sec-${Date.now()}`,
      name: `${section.name} (Cópia)`,
      display_order: (sections?.length || 0),
      created_at: new Date().toISOString()
    };
    saveSectionMutation.mutate(newSection);
    toast.success("Seção duplicada");
  };

  const handleToggleStatus = (section: PageSection) => {
    saveSectionMutation.mutate({
      ...section,
      status: section.status === 'ATIVA' ? 'OCULTA' : 'ATIVA'
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta seção? Esta ação não pode ser desfeita.")) {
      deleteMutation.mutate(id);
    }
  };

  const saveConfigMutation = useMutation({
    mutationFn: (config: any) => savePageConfig({ data: { pageId, config } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page', pageId] });
      toast.success("Configurações da página salvas");
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/editor"
            className="p-2 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white rounded-sm transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-white">{page?.name}</h1>
              <span className="text-xs text-neutral-500 font-mono tracking-wider">{page?.slug}</span>
            </div>
            <p className="text-neutral-400">Arraste para reordenar ou selecione uma seção para editar.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
            {saveStatus === 'saving' && (
                <div className="flex items-center gap-2 text-xs text-blue-400 animate-pulse">
                    <Save className="w-3 h-3" />
                    SALVANDO ORDEM...
                </div>
            )}
            {saveStatus === 'saved' && (
                <div className="flex items-center gap-2 text-xs text-green-500">
                    <CheckCircle2 className="w-3 h-3" />
                    ALTERAÇÕES SALVAS
                </div>
            )}
            {saveStatus === 'error' && (
                <div className="flex items-center gap-2 text-xs text-red-500">
                    <AlertCircle className="w-3 h-3" />
                    ERRO AO SALVAR
                </div>
            )}

            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-sm transition text-xs font-bold uppercase tracking-widest border border-white/10">
                <Plus className="w-4 h-4" />
                Adicionar Seção
            </button>
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-sm transition text-xs font-bold uppercase tracking-widest"
            >
                <Eye className="w-4 h-4" />
                Visualizar Site
            </Link>
        </div>
      </div>

      {pageId === 'artistas' && (
        <div className="bg-white/5 border border-white/10 rounded-sm p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-sm text-blue-500">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Configurações da Listagem</h2>
                <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Personalize como os artistas são apresentados aos visitantes</p>
              </div>
            </div>
            <button 
              onClick={() => saveConfigMutation.mutate(page?.config)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-sm transition text-[10px] font-bold uppercase tracking-widest border border-white/10"
            >
              <Save className="w-4 h-4" />
              Salvar Configuração
            </button>
          </div>
          
          <ArtistsPageEditor 
            value={page?.config || {}} 
            onChange={(config) => {
              queryClient.setQueryData(['page', pageId], (old: any) => ({ ...old, config }));
            }} 
          />
        </div>
      )}

      {pageId === 'artist_template' && (
        <div className="bg-white/5 border border-white/10 rounded-sm p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-sm text-purple-500">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Template Global de Artistas</h2>
                <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Configure a estrutura visual padrão para todos os perfis</p>
              </div>
            </div>
            <button 
              onClick={() => saveConfigMutation.mutate(page?.config)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-sm transition text-[10px] font-bold uppercase tracking-widest border border-white/10"
            >
              <Save className="w-4 h-4" />
              Salvar Template
            </button>
          </div>
          
          <ArtistTemplateEditor 
            value={page?.config || {}} 
            onChange={(config) => {
              queryClient.setQueryData(['page', pageId], (old: any) => ({ ...old, config }));
            }} 
          />
        </div>
      )}

      {pageId === 'global_nav' && (
        <div className="bg-white/5 border border-white/10 rounded-sm p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-sm text-blue-500">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Menu & Rodapé Global</h2>
                <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Configure a navegação e a identidade visual de base do site</p>
              </div>
            </div>
            <button 
              onClick={() => saveConfigMutation.mutate(page?.config)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-sm transition text-[10px] font-bold uppercase tracking-widest border border-white/10"
            >
              <Save className="w-4 h-4" />
              Salvar Menu & Rodapé
            </button>
          </div>
          
          <GlobalNavEditor 
            value={page?.config || {}} 
            onChange={(config) => {
              queryClient.setQueryData(['page', pageId], (old: any) => ({ ...old, config }));
            }} 
          />
        </div>
      )}

      {pageId === 'global_design' && (
        <div className="bg-white/5 border border-white/10 rounded-sm p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500/10 rounded-sm text-pink-500">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Design & Identidade Global</h2>
                <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Configure as variáveis visuais e a alma estética do site</p>
              </div>
            </div>
            <button 
              onClick={() => saveConfigMutation.mutate(page?.config)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-sm transition text-[10px] font-bold uppercase tracking-widest border border-white/10"
            >
              <Save className="w-4 h-4" />
              Salvar Design
            </button>
          </div>
          
          <GlobalDesignEditor 
            value={page?.config || {}} 
            onChange={(config) => {
              queryClient.setQueryData(['page', pageId], (old: any) => ({ ...old, config }));
            }} 
          />
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-white/5 animate-pulse rounded-sm border border-white/5" />
          ))
        ) : sections && sections.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid gap-4">
                {sections.map((section) => (
                  <SortableSectionItem 
                    key={section.id} 
                    section={section}
                    onEdit={(id) => {
                      const target = `/admin/editor/${pageId}/edit/${id}`;
                      console.log('Navigating to:', target);
                      window.location.href = target;
                    }} 



                    onDuplicate={handleDuplicate}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="p-12 border border-dashed border-white/10 rounded-sm flex flex-col items-center justify-center text-center space-y-4 bg-white/[0.02]">
            <Plus className="w-12 h-12 text-neutral-600" />
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Nenhuma seção nesta página</h4>
              <p className="text-sm text-neutral-400">Comece adicionando a primeira seção do seu site.</p>
            </div>
            <button className="px-6 py-2 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-neutral-200 transition">
              Criar Seção
            </button>
          </div>
        )}
      </div>
    </div>
  );
}