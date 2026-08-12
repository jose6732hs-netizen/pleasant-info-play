import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getPages } from '@/lib/cms.functions';
import { 
  FileText, 
  ChevronRight, 
  Settings, 
  Globe,
  Layout,
  Plus
} from 'lucide-react';

export const Route = createFileRoute('/admin/editor/')({
  component: AdminEditorDashboard,
});

function AdminEditorDashboard() {
  const { data: pages, isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: () => getPages(),
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">EDITOR DO SITE</h1>
          <p className="text-neutral-400">Gerencie as páginas, seções e a estrutura visual do site.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-sm transition text-xs font-bold uppercase tracking-widest border border-white/10">
          <Plus className="w-4 h-4" />
          Nova Página
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-white/5 animate-pulse rounded-sm border border-white/5" />
          ))
        ) : (
          pages?.map((page) => (
            <Link 
              key={page.id}
              to="/admin/editor/$pageId/"
              params={{ pageId: page.id }}
              className="group relative overflow-hidden bg-white/5 border border-white/5 hover:border-white/20 transition-all p-6 rounded-sm flex flex-col justify-between min-h-[160px]"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-white/5 rounded-sm group-hover:bg-white/10 transition">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                    page.status === 'PUBLICADO' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {page.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">{page.name}</h3>
                  <p className="text-xs text-neutral-500 mt-1">{page.slug}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                <span>Última edição: {new Date(page.created_at).toLocaleDateString()}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))
        )}

        <Link 
          to="/admin/editor/configuracoes-globais"
          className="group relative overflow-hidden bg-white/5 border border-white/5 hover:border-white/20 transition-all p-6 rounded-sm flex flex-col justify-between min-h-[160px]"
        >
          <div className="space-y-4">
            <div className="p-3 bg-white/5 rounded-sm group-hover:bg-white/10 transition w-fit">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white transition group-hover:text-blue-400">Configurações Globais</h3>
              <p className="text-xs text-neutral-500 mt-1">SEO, Favicon, Scripts e Cores</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            <span>Configurações do sistema</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      <div className="p-8 border border-dashed border-white/10 rounded-sm flex flex-col items-center justify-center text-center space-y-4 bg-white/[0.02]">
        <Layout className="w-12 h-12 text-neutral-600" />
        <div className="max-w-md">
          <h4 className="text-lg font-bold text-white mb-2">Editor Visual em Tempo Real</h4>
          <p className="text-sm text-neutral-400">
            Altere textos, imagens e a ordem das seções sem escrever uma linha de código. 
            Todas as alterações são refletidas instantaneamente na versão pública após a publicação.
          </p>
        </div>
      </div>
    </div>
  );
}