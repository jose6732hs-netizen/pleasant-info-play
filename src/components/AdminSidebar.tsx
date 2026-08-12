import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Briefcase, 
  FileText, 
  Settings, 
  MousePointer2, 
  Menu, 
  X,
  Sparkles,
  Layers,
  Edit3,
  Award
} from 'lucide-react';
import logoAsset from "@/assets/logo-completa.png.asset.json";

interface AdminSidebarProps {
  currentPath: string;
}

export function AdminSidebar({ currentPath }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/editor", label: "Editor do Site", icon: Edit3 },
    { to: "/admin/artistas", label: "Ranking Artistas", icon: Award },
    { to: "/admin/artistas/gerenciar", label: "Gerenciar Artistas", icon: Users },
    { to: "/admin/leads", label: "Leads & Tracking", icon: MousePointer2 },
    { to: "/admin/agenda", label: "Agenda", icon: Calendar },
    { to: "/admin/contratos", label: "Contratos", icon: Briefcase },
    { to: "/admin/solicitacoes", label: "Solicitações", icon: FileText },
    { to: "/admin/servicos", label: "Serviços", icon: Layers },
    { to: "/admin/conteudo", label: "Conteúdo", icon: Sparkles },
    { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-black border-b border-white/5 sticky top-0 z-50">
        <img src={logoAsset.url} alt="064 ADMIN" className="h-6 w-auto object-contain grayscale brightness-200" />
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-neutral-400 hover:text-white transition"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40
        h-screen w-64 bg-black border-r border-white/5 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col p-6 space-y-8
      `}>
        <div className="hidden md:flex justify-start mb-8">
          <img src={logoAsset.url} alt="064 ADMIN" className="h-8 w-auto object-contain grayscale brightness-200" />
        </div>
        
        <nav className="flex flex-col gap-1 text-xs text-neutral-400 uppercase tracking-widest overflow-y-auto pr-2 custom-scrollbar">
          {menuItems.map((item) => (
            <Link 
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={`
                p-3 transition rounded-sm flex items-center gap-3
                ${currentPath === item.to || (item.to === '/admin' && currentPath === '/admin/') 
                  ? 'bg-white/10 text-white font-bold' 
                  : 'hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon className="w-4 h-4" /> 
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
