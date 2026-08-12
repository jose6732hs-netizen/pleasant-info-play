import React, { useState, useEffect } from 'react';
import { Play, X, Settings2, Trash2, GripVertical, Youtube, Video, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export interface VideoConfig {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  caption?: string;
  source: 'youtube' | 'vimeo' | 'direct';
  autoplay: boolean;
  loop: boolean;
  controls: boolean;
  muted: boolean;
  lazy: boolean;
  isPrimary: boolean;
}

interface VideoEditorProps {
  value: VideoConfig;
  onChange: (value: VideoConfig) => void;
  onDelete?: () => void;
  label?: string;
}

export function VideoEditor({ value, onChange, onDelete, label }: VideoEditorProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value.url) {
      setPreviewUrl(null);
      return;
    }

    if (value.source === 'youtube') {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = value.url.match(regExp);
      if (match && match[2] && match[2].length === 11) {
        setPreviewUrl(`https://www.youtube.com/embed/${match[2]}`);
      }
    } else if (value.source === 'vimeo') {
      const regExp = /vimeo\.com\/([0-9]+)/;
      const match = value.url.match(regExp);
      if (match) {
        setPreviewUrl(`https://player.vimeo.com/video/${match[1]}`);
      }
    } else {
      setPreviewUrl(value.url);
    }
  }, [value.url, value.source]);

  const updateField = (updates: Partial<VideoConfig>) => {
    onChange({ ...value, ...updates });
  };

  return (
    <div className="space-y-6 bg-neutral-900/50 p-4 border border-white/5 rounded-sm">
      <div className="flex justify-between items-center">
        {label && (
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
            {label}
          </label>
        )}
        {onDelete && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onDelete}
            className="h-6 w-6 text-neutral-500 hover:text-red-400"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Preview Area */}
        <div className="relative aspect-video rounded-sm bg-black overflow-hidden border border-white/10 group">
          {previewUrl ? (
            value.source === 'direct' ? (
              <video 
                src={previewUrl} 
                className="w-full h-full object-cover" 
                controls={value.controls}
                muted={value.muted}
                loop={value.loop}
              />
            ) : (
              <iframe
                src={previewUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-700 gap-2">
              <Play className="w-12 h-12 opacity-20" />
              <p className="text-[9px] font-bold uppercase tracking-widest">Aguardando URL</p>
            </div>
          )}
        </div>

        {/* Basic Config */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[9px] uppercase tracking-widest text-neutral-500">Fonte</Label>
            <Select 
              value={value.source} 
              onValueChange={(v: any) => updateField({ source: v })}
            >
              <SelectTrigger className="bg-black border-white/10 text-[10px] uppercase tracking-widest h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-white/10">
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="vimeo">Vimeo</SelectItem>
                <SelectItem value="direct">URL Direta (MP4)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[9px] uppercase tracking-widest text-neutral-500">URL do Vídeo</Label>
            <Input 
              value={value.url} 
              onChange={(e) => updateField({ url: e.target.value })}
              className="bg-black border-white/10 text-xs h-9"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[9px] uppercase tracking-widest text-neutral-500">Título do Vídeo</Label>
          <Input 
            value={value.title} 
            onChange={(e) => updateField({ title: e.target.value })}
            className="bg-black border-white/10 text-xs h-9"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[9px] uppercase tracking-widest text-neutral-500">Descrição / Legenda</Label>
          <Textarea 
            value={value.description} 
            onChange={(e) => updateField({ description: e.target.value })}
            className="bg-black border-white/10 text-xs min-h-[60px] resize-none"
          />
        </div>

        {/* Video Settings */}
        <div className="pt-4 border-t border-white/5 space-y-4">
          <h4 className="text-[9px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-2">
            <Settings2 className="w-3 h-3" /> Configurações de Reprodução
          </h4>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-sm">
              <Label className="text-[9px] uppercase tracking-widest text-neutral-400">Autoplay</Label>
              <Switch 
                checked={value.autoplay} 
                onCheckedChange={(v) => updateField({ autoplay: v })}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-sm">
              <Label className="text-[9px] uppercase tracking-widest text-neutral-400">Loop</Label>
              <Switch 
                checked={value.loop} 
                onCheckedChange={(v) => updateField({ loop: v })}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-sm">
              <Label className="text-[9px] uppercase tracking-widest text-neutral-400">Controles</Label>
              <Switch 
                checked={value.controls} 
                onCheckedChange={(v) => updateField({ controls: v })}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-sm">
              <Label className="text-[9px] uppercase tracking-widest text-neutral-400">Mudo</Label>
              <Switch 
                checked={value.muted} 
                onCheckedChange={(v) => updateField({ muted: v })}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-black/30 rounded-sm">
            <Switch 
              checked={value.isPrimary} 
              onCheckedChange={(v) => updateField({ isPrimary: v })}
            />
            <Label className="text-[9px] uppercase tracking-widest text-neutral-400">Vídeo Principal da Seção</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
