import React from 'react';
import { 
  Settings2, 
  Maximize, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  ArrowUp, 
  ArrowDown, 
  Paintbrush, 
  Eye, 
  EyeOff 
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
import { ImageEditor } from './ImageEditor';
import { cn } from '@/lib/utils';

export interface SectionStyles {
  paddingTop: number;
  paddingBottom: number;
  contentWidth: 'normal' | 'wide' | 'full';
  alignment: 'left' | 'center' | 'right';
  backgroundType: 'color' | 'image' | 'gradient';
  backgroundColor: 'black' | 'graphite' | 'white';
  backgroundImage?: string;
  backgroundOverlay: boolean;
  overlayOpacity: number;
  sectionHeight: 'auto' | 'small' | 'medium' | 'large' | 'viewport';
  isVisible: boolean;
}

interface SectionStyleEditorProps {
  value: SectionStyles;
  onChange: (value: SectionStyles) => void;
}

export function SectionStyleEditor({ value, onChange }: SectionStyleEditorProps) {
  const updateField = (updates: Partial<SectionStyles>) => {
    onChange({ ...value, ...updates });
  };

  const defaultStyles: SectionStyles = {
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
  };

  const current = { ...defaultStyles, ...value };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Visibilidade e Status */}
      <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-sm">
        <div className="flex items-center gap-3">
          {current.isVisible ? <Eye className="w-4 h-4 text-white" /> : <EyeOff className="w-4 h-4 text-neutral-600" />}
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest",
            current.isVisible ? "text-white" : "text-neutral-500"
          )}>
            {current.isVisible ? 'Seção Visível' : 'Seção Oculta'}
          </span>
        </div>
        <Switch 
          checked={current.isVisible} 
          onCheckedChange={(v) => updateField({ isVisible: v })}
        />
      </div>

      {/* Espaçamento */}
      <div className="space-y-4">
        <h4 className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.2em] flex items-center gap-2">
          <ArrowUp className="w-3 h-3" /> Espaçamentos (px)
        </h4>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-[9px] uppercase tracking-widest text-neutral-500">Superior</Label>
              <span className="text-[9px] text-white font-mono">{current.paddingTop}</span>
            </div>
            <Slider 
              value={[current.paddingTop]} 
              onValueChange={([v]) => updateField({ paddingTop: v })}
              max={200}
              step={8}
            />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-[9px] uppercase tracking-widest text-neutral-500">Inferior</Label>
              <span className="text-[9px] text-white font-mono">{current.paddingBottom}</span>
            </div>
            <Slider 
              value={[current.paddingBottom]} 
              onValueChange={([v]) => updateField({ paddingBottom: v })}
              max={200}
              step={8}
            />
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <h4 className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.2em] flex items-center gap-2">
          <Maximize className="w-3 h-3" /> Layout & Altura
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[9px] uppercase tracking-widest text-neutral-500">Largura</Label>
            <Select 
              value={current.contentWidth} 
              onValueChange={(v: any) => updateField({ contentWidth: v })}
            >
              <SelectTrigger className="bg-black border-white/10 text-[10px] uppercase tracking-widest h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-white/10">
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="wide">Largo (Wide)</SelectItem>
                <SelectItem value="full">Total (Full)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[9px] uppercase tracking-widest text-neutral-500">Altura</Label>
            <Select 
              value={current.sectionHeight} 
              onValueChange={(v: any) => updateField({ sectionHeight: v })}
            >
              <SelectTrigger className="bg-black border-white/10 text-[10px] uppercase tracking-widest h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-white/10">
                <SelectItem value="auto">Automática</SelectItem>
                <SelectItem value="small">Pequena</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="large">Grande</SelectItem>
                <SelectItem value="viewport">Tela Inteira</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[9px] uppercase tracking-widest text-neutral-500">Alinhamento do Conteúdo</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'left', icon: AlignLeft },
              { id: 'center', icon: AlignCenter },
              { id: 'right', icon: AlignRight },
            ].map((align) => (
              <button
                key={align.id}
                onClick={() => updateField({ alignment: align.id as any })}
                className={cn(
                  "p-2 flex justify-center rounded-sm border transition",
                  current.alignment === align.id 
                    ? "bg-white border-white text-black" 
                    : "bg-black border-white/10 text-neutral-500 hover:text-white"
                )}
              >
                <align.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fundo */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <h4 className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.2em] flex items-center gap-2">
          <Paintbrush className="w-3 h-3" /> Estilo de Fundo
        </h4>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[9px] uppercase tracking-widest text-neutral-500">Tipo de Fundo</Label>
            <Select 
              value={current.backgroundType} 
              onValueChange={(v: any) => updateField({ backgroundType: v })}
            >
              <SelectTrigger className="bg-black border-white/10 text-[10px] uppercase tracking-widest h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-white/10">
                <SelectItem value="color">Cor Sólida</SelectItem>
                <SelectItem value="image">Imagem</SelectItem>
                <SelectItem value="gradient">Gradiente Cinematic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {current.backgroundType === 'color' && (
            <div className="space-y-2">
              <Label className="text-[9px] uppercase tracking-widest text-neutral-500">Cor</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'black', label: 'Preto', color: '#000000' },
                  { id: 'graphite', label: 'Grafite', color: '#1a1a1a' },
                  { id: 'white', label: 'Branco', color: '#ffffff' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => updateField({ backgroundColor: c.id as any })}
                    className={cn(
                      "p-3 rounded-sm border transition flex flex-col items-center gap-2",
                      current.backgroundColor === c.id 
                        ? "border-white" 
                        : "border-white/10 hover:border-white/30"
                    )}
                  >
                    <div className="w-full h-4 rounded-full border border-white/10" style={{ backgroundColor: c.color }} />
                    <span className="text-[8px] uppercase font-bold tracking-widest">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {current.backgroundType === 'image' && (
            <div className="space-y-4">
              <ImageEditor 
                label="Imagem de Fundo"
                value={{
                  url: current.backgroundImage || '',
                  alt: 'Background',
                  position: 'center',
                  objectFit: 'cover',
                  overlay: current.backgroundOverlay,
                  overlayOpacity: current.overlayOpacity,
                  isBackground: true
                }}
                onChange={(img) => updateField({ 
                  backgroundImage: img.url,
                  backgroundOverlay: img.overlay,
                  overlayOpacity: img.overlayOpacity
                })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
