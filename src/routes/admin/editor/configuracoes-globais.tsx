import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { 
  ChevronLeft, 
  Save, 
  Globe, 
  Search, 
  Image as ImageIcon,
  Palette,
  Type,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/editor/configuracoes-globais')({
  component: GlobalSettings,
});

function GlobalSettings() {
  const handleSave = () => {
    toast.success("Configurações globais salvas com sucesso");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/editor"
            className="p-2 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white rounded-sm transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Configurações Globais</h1>
            <p className="text-neutral-400">Gerencie a identidade visual e configurações técnicas do site.</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-sm transition text-xs font-bold uppercase tracking-widest"
        >
          <Save className="w-4 h-4" />
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/5 p-6 rounded-sm space-y-6">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
            <Search className="w-3 h-3" /> SEO & Metadados
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Título do Site</label>
              <input type="text" defaultValue="064 TALENTS | Artist Booking & Entertainment" className="w-full bg-black border border-white/10 p-3 rounded-sm text-sm text-white focus:outline-none focus:border-white transition" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Descrição (Meta Description)</label>
              <textarea defaultValue="Representando talentos. Criando conexões. Do Goiás pro mundo." className="w-full bg-black border border-white/10 p-3 rounded-sm text-sm text-white focus:outline-none focus:border-white transition min-h-[80px] resize-none" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 p-6 rounded-sm space-y-6">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
            <ImageIcon className="w-3 h-3" /> Identidade Visual
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Logo Principal (Metallic)</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-black border border-white/10 rounded-sm flex items-center justify-center">
                  <Globe className="w-8 h-8 text-neutral-700" />
                </div>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest border border-white/10 rounded-sm transition">
                  Alterar Imagem
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Favicon (16x16)</label>
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest border border-white/10 rounded-sm transition">
                Upload Favicon
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 p-6 rounded-sm space-y-6">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
            <Palette className="w-3 h-3" /> Cores do Sistema
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Primária</label>
              <div className="flex items-center gap-2 bg-black border border-white/10 p-2 rounded-sm">
                <div className="w-4 h-4 bg-white rounded-full border border-white/20" />
                <span className="text-xs text-white">#FFFFFF</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Destaque</label>
              <div className="flex items-center gap-2 bg-black border border-white/10 p-2 rounded-sm">
                <div className="w-4 h-4 bg-blue-500 rounded-full border border-white/20" />
                <span className="text-xs text-white">#3B82F6</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 p-6 rounded-sm space-y-6">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" /> Scripts & Segurança
          </h3>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Google Analytics ID</label>
            <input type="text" placeholder="G-XXXXXXXXXX" className="w-full bg-black border border-white/10 p-3 rounded-sm text-sm text-white focus:outline-none focus:border-white transition" />
          </div>
        </div>
      </div>
    </div>
  );
}