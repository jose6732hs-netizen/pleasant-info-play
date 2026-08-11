import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 bg-black/40 p-10 border border-white/5 rounded-sm">
        <div className="text-center space-y-2">
          <div className="text-3xl font-black tracking-tighter uppercase">064 TALENTS</div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">Acesso Administrativo</p>
        </div>
        
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">E-mail</label>
            <input 
              type="email" 
              placeholder="admin@064talents.com.br"
              className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition text-sm" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Senha</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition text-sm" 
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-white text-black py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition"
          >
            Entrar no Painel
          </button>
        </form>
        
        <div className="text-center">
            <a href="/" className="text-[10px] uppercase tracking-widest text-neutral-600 hover:text-white transition">Voltar para o site</a>
        </div>
      </div>
    </div>
  );
}
