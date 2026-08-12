import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export interface ImageConfig {
  url: string;
  mobileUrl?: string;
  alt: string;
  title?: string;
  caption?: string;
  position: 'center' | 'top' | 'bottom' | 'left' | 'right';
  objectFit: 'cover' | 'contain';
  overlay: boolean;
  overlayOpacity: number;
  isBackground: boolean;
}

interface ImageEditorProps {
  value: ImageConfig;
  onChange: (value: ImageConfig) => void;
  label?: string;
}

export function ImageEditor({ value, onChange, label }: ImageEditorProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // In a real app, this would upload to a server/S3
    // For now, we create a local URL for preview
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...value, url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }, [value, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const updateField = (updates: Partial<ImageConfig>) => {
    onChange({ ...value, ...updates });
  };

  return (
    <div className="space-y-6 bg-neutral-900/50 p-4 border border-white/5 rounded-sm">
      {label && (
        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
          {label}
        </label>
      )}

      <div className="space-y-4">
        {/* Preview & Upload */}
        <div 
          {...getRootProps()} 
          className={`
            relative aspect-video rounded-sm border-2 border-dashed transition-colors cursor-pointer overflow-hidden
            ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20 bg-black/50'}
          `}
        >
          <input {...getInputProps()} />
          
          {value.url ? (
            <>
              <img 
                src={value.url} 
                alt={value.alt} 
                className={`w-full h-full object-${value.objectFit} object-${value.position}`} 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary" className="text-[10px] font-bold uppercase tracking-widest">
                  Substituir
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="text-[10px] font-bold uppercase tracking-widest"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateField({ url: '' });
                  }}
                >
                  Excluir
                </Button>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 gap-2">
              <Upload className="w-8 h-8 opacity-20" />
              <p className="text-[9px] font-bold uppercase tracking-widest">
                {isDragActive ? 'Solte aqui' : 'Upload ou Arraste'}
              </p>
            </div>
          )}
        </div>

        {/* Basic Config */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[9px] uppercase tracking-widest text-neutral-500">Alt Text</Label>
            <Input 
              value={value.alt} 
              onChange={(e) => updateField({ alt: e.target.value })}
              className="bg-black border-white/10 text-xs h-9"
              placeholder="Descrição para SEO"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[9px] uppercase tracking-widest text-neutral-500">URL da Imagem</Label>
            <div className="flex gap-2">
              <Input 
                value={value.url} 
                onChange={(e) => updateField({ url: e.target.value })}
                className="bg-black border-white/10 text-xs h-9"
                placeholder="URL externa..."
              />
              <Input 
                value={value.title || ''} 
                onChange={(e) => updateField({ title: e.target.value })}
                className="bg-black border-white/10 text-xs h-9 w-1/3"
                placeholder="Título"
              />
            </div>
          </div>
        </div>

        {/* Layout Config */}
        <div className="pt-4 border-t border-white/5 space-y-4">
          <h4 className="text-[9px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-2">
            <Settings2 className="w-3 h-3" /> Layout & Efeitos
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[9px] uppercase tracking-widest text-neutral-500">Posição</Label>
              <Select 
                value={value.position} 
                onValueChange={(v: any) => updateField({ position: v })}
              >
                <SelectTrigger className="bg-black border-white/10 text-[10px] uppercase tracking-widest h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-white/10">
                  <SelectItem value="center">Centralizado</SelectItem>
                  <SelectItem value="top">Topo</SelectItem>
                  <SelectItem value="bottom">Base</SelectItem>
                  <SelectItem value="left">Esquerda</SelectItem>
                  <SelectItem value="right">Direita</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[9px] uppercase tracking-widest text-neutral-500">Ajuste (Fit)</Label>
              <Select 
                value={value.objectFit} 
                onValueChange={(v: any) => updateField({ objectFit: v })}
              >
                <SelectTrigger className="bg-black border-white/10 text-[10px] uppercase tracking-widest h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-white/10">
                  <SelectItem value="cover">Cobrir (Cover)</SelectItem>
                  <SelectItem value="contain">Conter (Contain)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-black/30 rounded-sm">
            <div className="flex items-center gap-3">
              <Switch 
                checked={value.overlay} 
                onCheckedChange={(v) => updateField({ overlay: v })}
              />
              <Label className="text-[9px] uppercase tracking-widest text-neutral-400">Overlay Escuro</Label>
            </div>
            {value.overlay && (
              <div className="w-24">
                <Slider 
                  value={[value.overlayOpacity || 0]} 
                  onValueChange={([v]) => updateField({ overlayOpacity: v as number })}
                  max={100}
                  step={1}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 p-3 bg-black/30 rounded-sm">
            <Switch 
              checked={value.isBackground} 
              onCheckedChange={(v) => updateField({ isBackground: v })}
            />
            <Label className="text-[9px] uppercase tracking-widest text-neutral-400">Usar como Fundo</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
