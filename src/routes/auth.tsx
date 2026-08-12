import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { loginAdmin } from "@/lib/auth.functions";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import logoAsset from "@/assets/logo-completa.png.asset.json";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: (vars: any) => loginAdmin({ data: vars }),
    onSuccess: (data) => {
      localStorage.setItem("064_auth_token", data.token);
      toast.success("Acesso autorizado!");
      navigate({ to: "/admin" });
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao realizar login");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 bg-black/40 p-10 border border-white/5 rounded-sm">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <img src={logoAsset.url} alt="064 TALENTS" className="h-16 w-auto object-contain" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">Acesso Administrativo</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sempreteste552@gmail.com"
              className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition text-sm" 
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition text-sm" 
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-white text-black py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition disabled:opacity-50"
          >
            {loginMutation.isPending ? "Autenticando..." : "Entrar no Painel"}
          </button>
        </form>
        
        <div className="text-center pt-4">
            <a href="/" className="text-[10px] uppercase tracking-widest text-neutral-600 hover:text-white transition">Voltar para o site</a>
        </div>
        
        <div className="mt-8 p-4 bg-white/5 border border-white/5 rounded-sm">
          <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-widest text-center leading-relaxed">
            Acesso Padrão (Primeira Conta):<br />
            sempreteste552@gmail.com / Kaique@321
          </p>
        </div>
      </div>
    </div>
  );
}

