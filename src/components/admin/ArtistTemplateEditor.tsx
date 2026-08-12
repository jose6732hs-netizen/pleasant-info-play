import React from 'react';
import { GripVertical, Eye, EyeOff, Layout, Type, Image as ImageIcon, Video, Share2, Info, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BlockConfig {
  id: string;
  name: string;
  active: boolean;
  order: number;
}

interface ArtistTemplateConfig {
  blocks: BlockConfig[];
  heroStyle: 'cinematic' | 'minimal' | 'bold';
  showGenre: boolean;
  showDescription: boolean;
  bookingButtons: {
    contract: boolean;
    quote: boolean;
  };
}

interface ArtistTemplateEditorProps {
  value: ArtistTemplateConfig;
  onChange: (value: ArtistTemplateConfig) => void;
}

function SortableBlockItem({ block, onToggle }: { block: BlockConfig; onToggle: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'hero': return <Layout className="w-4 h-4" />;
      case 'bio': return <Type className="w-4 h-4" />;
      case 'gallery': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'social': return <Share2 className="w-4 h-4" />;
      case 'trajectory': return <Info className="w-4 h-4" />;
      case 'cta': return <MessageSquare className="w-4 h-4" />;
      default: return <Layout className="w-4 h-4" />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-4 p-4 bg-black/40 border rounded-sm transition-all",
        isDragging ? "border-blue-500 bg-white/5 scale-[1.02] shadow-2xl" : "border-white/5 hover:border-white/10",
        !block.active && "opacity-50"
      )}
    >
      <button 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-neutral-600 hover:text-white transition"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-3 flex-1">
        <div className="p-2 bg-white/5 rounded-sm text-neutral-400">
          {getIcon(block.id)}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-white">{block.name}</span>
      </div>

      <div className="flex items-center gap-3">
        <Switch 
          checked={block.active} 
          onCheckedChange={() => onToggle(block.id)}
        />
        {block.active ? <Eye className="w-3 h-3 text-blue-400" /> : <EyeOff className="w-3 h-3 text-neutral-600" />}
      </div>
    </div>
  );
}

export function ArtistTemplateEditor({ value, onChange }: ArtistTemplateEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = value.blocks.findIndex((b) => b.id === active.id);
    const newIndex = value.blocks.findIndex((b) => b.id === over.id);

    const newBlocks = arrayMove(value.blocks, oldIndex, newIndex).map((b, i) => ({
      ...b,
      order: i
    }));

    onChange({ ...value, blocks: newBlocks });
  };

  const handleToggleBlock = (id: string) => {
    const newBlocks = value.blocks.map(b => 
      b.id === id ? { ...b, active: !b.active } : b
    );
    onChange({ ...value, blocks: newBlocks });
  };

  const updateConfig = (updates: Partial<ArtistTemplateConfig>) => {
    onChange({ ...value, ...updates });
  };

  return (
    <div className="space-y-8">
      <Accordion type="single" collapsible className="space-y-4">
        {/* Ordem dos Blocos */}
        <AccordionItem value="structure" className="border border-white/5 bg-black/20 px-6 rounded-sm">
          <AccordionTrigger className="hover:no-underline py-6">
            <div className="flex items-center gap-3">
              <Layout className="w-4 h-4 text-blue-500" />
              <div className="text-left">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Estrutura & Ordem</h4>
                <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">Arraste para definir a hierarquia visual da página</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={value.blocks.map(b => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {value.blocks.map((block) => (
                    <SortableBlockItem 
                      key={block.id} 
                      block={block} 
                      onToggle={handleToggleBlock} 
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </AccordionContent>
        </AccordionItem>

        {/* Estilo do Hero */}
        <AccordionItem value="hero" className="border border-white/5 bg-black/20 px-6 rounded-sm">
          <AccordionTrigger className="hover:no-underline py-6">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-4 h-4 text-purple-500" />
              <div className="text-left">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Cabeçalho (Hero)</h4>
                <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">Configure o impacto inicial da página</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-[10px] uppercase tracking-widest text-neutral-400">Estilo Visual</Label>
                <Select 
                  value={value.heroStyle} 
                  onValueChange={(v: any) => updateConfig({ heroStyle: v })}
                >
                  <SelectTrigger className="bg-black border-white/10 text-[10px] uppercase tracking-widest">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-white/10">
                    <SelectItem value="cinematic">Cinemático (Full Height)</SelectItem>
                    <SelectItem value="minimal">Minimalista (Split Screen)</SelectItem>
                    <SelectItem value="bold">Bold (Typography First)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-black/40 rounded-sm">
                  <Label className="text-[9px] uppercase tracking-widest text-neutral-300">Mostrar Gênero Musical</Label>
                  <Switch 
                    checked={value.showGenre} 
                    onCheckedChange={(v) => updateConfig({ showGenre: v })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-black/40 rounded-sm">
                  <Label className="text-[9px] uppercase tracking-widest text-neutral-300">Mostrar Descrição Curta</Label>
                  <Switch 
                    checked={value.showDescription} 
                    onCheckedChange={(v) => updateConfig({ showDescription: v })}
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Botões de Booking */}
        <AccordionItem value="booking" className="border border-white/5 bg-black/20 px-6 rounded-sm">
          <AccordionTrigger className="hover:no-underline py-6">
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-green-500" />
              <div className="text-left">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Botões de Conversão</h4>
                <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">Gerencie as chamadas para contratação</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/40 rounded-sm">
              <div>
                <h5 className="text-[10px] font-bold text-white uppercase tracking-widest">Botão Contratar</h5>
                <p className="text-[8px] text-neutral-500 uppercase tracking-widest">Abre formulário de solicitação de data</p>
              </div>
              <Switch 
                checked={value.bookingButtons.contract} 
                onCheckedChange={(v) => updateConfig({ 
                  bookingButtons: { ...value.bookingButtons, contract: v } 
                })}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-black/40 rounded-sm">
              <div>
                <h5 className="text-[10px] font-bold text-white uppercase tracking-widest">Botão Orçamento</h5>
                <p className="text-[8px] text-neutral-500 uppercase tracking-widest">Direciona para contato via WhatsApp/Email</p>
              </div>
              <Switch 
                checked={value.bookingButtons.quote} 
                onCheckedChange={(v) => updateConfig({ 
                  bookingButtons: { ...value.bookingButtons, quote: v } 
                })}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-sm">
        <p className="text-[9px] text-blue-400 uppercase tracking-widest leading-relaxed">
          <Info className="w-3 h-3 inline-block mr-2" />
          <strong>Nota:</strong> Este template é global. Alterações feitas aqui refletirão instantaneamente em todas as páginas de artistas do site, mantendo a consistência visual da agência.
        </p>
      </div>
    </div>
  );
}