import { createFileRoute } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/admin/configuracoes")({
  component: AdminSettings,
});

function AdminSettings() {
  return (
    <div className="p-6 md:p-12 space-y-12">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase">Configurações</h1>
        <p className="text-neutral-500 text-sm mt-2">Ajustes da conta e plataforma.</p>
      </header>

      <div className="space-y-8">
        <section className="p-6 md:p-8 border border-white/5 bg-neutral-900/30 rounded-sm space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Perfil do Administrador</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Nome de Exibição</label>
                    <input type="text" defaultValue="Administrador 064" className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">E-mail</label>
                    <input type="email" defaultValue="sempreteste552@gmail.com" className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition" />
                </div>
            </div>
        </section>

        <section className="p-6 md:p-8 border border-white/5 bg-neutral-900/30 rounded-sm space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Segurança</h2>
            <button className="w-full sm:w-auto text-xs font-bold uppercase tracking-widest border border-white/10 px-6 py-3 rounded-full hover:bg-white/5 transition">
                Alterar Senha
            </button>
        </section>
      </div>

      <div className="flex justify-end pt-8">
        <button 
          onClick={() => {
            localStorage.removeItem("064_auth_token");
            window.location.href = "/auth";
          }}
          className="w-full sm:w-auto bg-red-950/20 text-red-500 border border-red-900/30 px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-900/40 transition flex items-center justify-center gap-3"
        >
            <LogOut className="w-4 h-4" /> Sair do Sistema
        </button>
      </div>
    </div>
  );
}
