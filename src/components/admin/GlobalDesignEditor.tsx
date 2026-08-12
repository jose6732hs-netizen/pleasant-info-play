import React from 'react';
import { Palette, Type, Square, Layout, RotateCcw } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface GlobalDesignConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    textSecondary: string;
    accent: string;
  };
  typography: {
    titleFont: string;
    textFont: string;
    baseSize: number;
    titleWeight: string;
    letterSpacing: string;
  };
  buttons: {
    radius: number;
    height: number;
    padding: number;
  };
  cards: {
    radius: number;
    border: boolean;
    shadow: boolean;
  };
}

interface GlobalDesignEditorProps {
  value: GlobalDesignConfig;
  onChange: (value: GlobalDesignConfig) => void;
}

export function GlobalDesignEditor({ value, onChange }: GlobalDesignEditorProps) {
  const resetDesign = () => {
    onChange({
      colors: {
        primary: '#ffffff',
        secondary: '#a3a3a3',
        background: '#0a0a0a',
        text: '#ffffff',
        textSecondary: '#737373',
        accent: '#3b82f6'
      },
      typography: {
        titleFont: 'system-ui',
        textFont: 'system-ui',
        baseSize: 16,
        titleWeight: '900',
        letterSpacing: '0.1em'
      },
      buttons: {
        radius: 9999,
        height: 48,
        padding: 32
      },
      cards: {
        radius: 4,
        border: true,
        shadow: false
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetDesign}
          className="h-7 text-[9px] uppercase tracking-widest border-white/10"
        >
          <RotateCcw className="w-3 h-3 mr-1" /> Resetar Padrão
        </Button>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {/* IDENTIDADE VISUAL */}
        <AccordionItem value="colors" className="border border-white/5 bg-black/20 px-6 rounded-sm">
          <AccordionTrigger className="hover:no-underline py-6">
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-blue-500" />
              <div className="text-left">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Identidade Visual</h4>
                <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">Cores e paleta da marca</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(value.colors).map(([key, color]) => (
                <div key={key} className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-neutral-400">
                    {key === 'primary' ? 'Primária' : 
                     key === 'secondary' ? 'Secundária' :
                     key === 'background' ? 'Fundo' :
                     key === 'text' ? 'Texto' :
                     key === 'textSecondary' ? 'Texto Secundário' : 'Acento'}
                  </Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded-sm border border-white/10 flex-shrink-0" 
                      style={{ backgroundColor: color }} 
                    />
                    <Input 
                      type="text"
                      value={color} 
                      onChange={(e) => onChange({
                        ...value,
                        colors: { ...value.colors, [key]: e.target.value }
                      })}
                      className="bg-black border-white/10 text-[10px] font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* TIPOGRAFIA */}
        <AccordionItem value="typography" className="border border-white/5 bg-black/20 px-6 rounded-sm">
          <AccordionTrigger className="hover:no-underline py-6">
            <div className="flex items-center gap-3">
              <Type className="w-4 h-4 text-purple-500" />
              <div className="text-left">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Tipografia</h4>
                <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">Fontes e escala de texto</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-neutral-400">Fonte dos Títulos</Label>
                <Input 
                  value={value.typography.titleFont} 
                  onChange={(e) => onChange({
                    ...value,
                    typography: { ...value.typography, titleFont: e.target.value }
                  })}
                  className="bg-black border-white/10 text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-neutral-400">Fonte dos Textos</Label>
                <Input 
                  value={value.typography.textFont} 
                  onChange={(e) => onChange({
                    ...value,
                    typography: { ...value.typography, textFont: e.target.value }
                  })}
                  className="bg-black border-white/10 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-[10px] uppercase tracking-widest text-neutral-400">Tamanho Base</Label>
                  <span className="text-[10px] text-white">{value.typography.baseSize}px</span>
                </div>
                <Slider 
                  value={[value.typography.baseSize]} 
                  min={12} 
                  max={24} 
                  step={1}
                  onValueChange={([v]) => onChange({
                    ...value,
                    typography: { ...value.typography, baseSize: v }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-neutral-400">Peso Títulos</Label>
                <Input 
                  value={value.typography.titleWeight} 
                  onChange={(e) => onChange({
                    ...value,
                    typography: { ...value.typography, titleWeight: e.target.value }
                  })}
                  className="bg-black border-white/10 text-xs"
                  placeholder="ex: 900"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-neutral-400">Letter Spacing</Label>
                <Input 
                  value={value.typography.letterSpacing} 
                  onChange={(e) => onChange({
                    ...value,
                    typography: { ...value.typography, letterSpacing: e.target.value }
                  })}
                  className="bg-black border-white/10 text-xs"
                  placeholder="ex: 0.1em"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* BOTÕES */}
        <AccordionItem value="buttons" className="border border-white/5 bg-black/20 px-6 rounded-sm">
          <AccordionTrigger className="hover:no-underline py-6">
            <div className="flex items-center gap-3">
              <Square className="w-4 h-4 text-green-500" />
              <div className="text-left">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Botões</h4>
                <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">Formato e espaçamento de CTAs</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-[10px] uppercase tracking-widest text-neutral-400">Raio (Corner)</Label>
                  <span className="text-[10px] text-white">{value.buttons.radius}px</span>
                </div>
                <Slider 
                  value={[value.buttons.radius > 50 ? 50 : value.buttons.radius]} 
                  min={0} 
                  max={50} 
                  step={1}
                  onValueChange={([v]) => onChange({
                    ...value,
                    buttons: { ...value.buttons, radius: v === 50 ? 9999 : v }
                  })}
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-[10px] uppercase tracking-widest text-neutral-400">Altura</Label>
                  <span className="text-[10px] text-white">{value.buttons.height}px</span>
                </div>
                <Slider 
                  value={[value.buttons.height]} 
                  min={32} 
                  max={64} 
                  step={2}
                  onValueChange={([v]) => onChange({
                    ...value,
                    buttons: { ...value.buttons, height: v }
                  })}
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-[10px] uppercase tracking-widest text-neutral-400">Padding Lateral</Label>
                  <span className="text-[10px] text-white">{value.buttons.padding}px</span>
                </div>
                <Slider 
                  value={[value.buttons.padding]} 
                  min={16} 
                  max={64} 
                  step={2}
                  onValueChange={([v]) => onChange({
                    ...value,
                    buttons: { ...value.buttons, padding: v }
                  })}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* CARDS */}
        <AccordionItem value="cards" className="border border-white/5 bg-black/20 px-6 rounded-sm">
          <AccordionTrigger className="hover:no-underline py-6">
            <div className="flex items-center gap-3">
              <Layout className="w-4 h-4 text-orange-500" />
              <div className="text-left">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Cards</h4>
                <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">Estilo de grades e containers</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-[10px] uppercase tracking-widest text-neutral-400">Raio (Corner)</Label>
                  <span className="text-[10px] text-white">{value.cards.radius}px</span>
                </div>
                <Slider 
                  value={[value.cards.radius]} 
                  min={0} 
                  max={32} 
                  step={1}
                  onValueChange={([v]) => onChange({
                    ...value,
                    cards: { ...value.cards, radius: v }
                  })}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-black/40 rounded-sm border border-white/5">
                <Label className="text-[10px] uppercase tracking-widest text-neutral-400">Borda</Label>
                <Switch 
                  checked={value.cards.border} 
                  onCheckedChange={(v) => onChange({
                    ...value,
                    cards: { ...value.cards, border: v }
                  })}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-black/40 rounded-sm border border-white/5">
                <Label className="text-[10px] uppercase tracking-widest text-neutral-400">Sombra</Label>
                <Switch 
                  checked={value.cards.shadow} 
                  onCheckedChange={(v) => onChange({
                    ...value,
                    cards: { ...value.cards, shadow: v }
                  })}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}