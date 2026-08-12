import React from 'react';
import { 
  LayoutGrid, 
  Settings2, 
  Eye, 
  Image as ImageIcon,
  Columns,
  Filter,
  Search,
  Paintbrush
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { RichTextEditor } from './RichTextEditor';
import { ImageEditor } from './ImageEditor';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface ArtistsPageConfig {
  title: string;
  subtitle: string;
  introText: string;
  bannerUrl: string;
  columnsDesktop: number;
  columnsTablet: number;
  columnsMobile: number;
  showGenre: boolean;
  showCity: boolean;
  showDescription: boolean;
  showViewButton: boolean;
  showBookingButton: boolean;
  showFeaturedFirst: boolean;
  featuredCount: number;
  enableFilter: boolean;
  enableSearch: boolean;
  cardStyle: 'glass' | 'minimal' | 'bordered';
  cardHover: 'zoom' | 'glow' | 'lift';
  spacing: 'small' | 'medium' | 'large';
  background: 'black' | 'graphite' | 'custom';
  customBackgroundUrl?: string;
}

interface ArtistsPageEditorProps {
  value: ArtistsPageConfig;
  onChange: (value: ArtistsPageConfig) => void;
}

export function ArtistsPageEditor({ value, onChange }: ArtistsPageEditorProps) {
  const updateField = (updates: Partial<ArtistsPageConfig>) => {
    onChange({ ...value, ...updates });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Accordion type="multiple" defaultValue={['content']} className="w-full">
        {/* Conteúdo & Banner */}
        <AccordionItem value="content" className="border-white/5">
          <AccordionTrigger className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-3 h-3" /> Conteúdo & Topo
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-2 pb-4">
            <RichTextEditor 
              label="Título da Página"
              value={value.title}
              onChange={(v) => updateField({ title: v })}
              type="title"
            />
            <RichTextEditor 
              label="Subtítulo"
              value={value.subtitle}
              onChange={(v) => updateField({ subtitle: v })}
              type="body"
            />
            <ImageEditor 
              label="Banner do Topo"
              value={{
                url: value.bannerUrl,
                alt: 'Artists Page Banner',
                position: 'center',
                objectFit: 'cover',
                overlay: true,
                overlayOpacity: 50,
                isBackground: true
              }}
              onChange={(img) => updateField({ bannerUrl: img.url })}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Layout da Grade */}
        <AccordionItem value="grid" className="border-white/5">
          <AccordionTrigger className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <Columns className="w-3 h-3" /> Layout da Grade
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-2 pb-4">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-[9px] uppercase tracking-widest text-neutral-500">Colunas Desktop</Label>
                  <span className="text-[9px] text-white font-mono">{value.columnsDesktop}</span>
                </div>
                <Slider 
                  value={[value.columnsDesktop]} 
                  onValueChange={([v]) => updateField({ columnsDesktop: v as number })}
                  min={1}
                  max={6}
                  step={1}
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-[9px] uppercase tracking-widest text-neutral-500">Colunas Tablet</Label>
                  <span className="text-[9px] text-white font-mono">{value.columnsTablet}</span>
                </div>
                <Slider 
                  value={[value.columnsTablet]} 
                  onValueChange={([v]) => updateField({ columnsTablet: v as number })}
                  min={1}
                  max={4}
                  step={1}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Cards & Visibilidade */}
        <AccordionItem value="cards" className="border-white/5">
          <AccordionTrigger className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-3 h-3" /> Cards & Detalhes
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2 pb-4">
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'showGenre', label: 'Mostrar Gênero' },
                { id: 'showCity', label: 'Mostrar Cidade' },
                { id: 'showDescription', label: 'Mostrar Descrição' },
                { id: 'showViewButton', label: 'Botão Ver Artista' },
                { id: 'showBookingButton', label: 'Botão Contratar' },
                { id: 'showFeaturedFirst', label: 'Destaques Primeiro' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-sm border border-white/10">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white">{item.label}</span>
                  <Switch 
                    checked={(value as any)[item.id]} 
                    onCheckedChange={(v) => updateField({ [item.id]: v })}
                  />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Filtros & Busca */}
        <AccordionItem value="filters" className="border-white/5">
          <AccordionTrigger className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <Filter className="w-3 h-3" /> Filtros & Busca
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2 pb-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-sm border border-white/10">
              <div className="flex items-center gap-2">
                <Filter className="w-3 h-3 text-neutral-500" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-white">Habilitar Filtros</span>
              </div>
              <Switch checked={value.enableFilter} onCheckedChange={(v) => updateField({ enableFilter: v })} />
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-sm border border-white/10">
              <div className="flex items-center gap-2">
                <Search className="w-3 h-3 text-neutral-500" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-white">Habilitar Busca</span>
              </div>
              <Switch checked={value.enableSearch} onCheckedChange={(v) => updateField({ enableSearch: v })} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
