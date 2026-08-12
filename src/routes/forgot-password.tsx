import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { requestPasswordReset } from "@/lib/auth.functions";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";
import logoAsset from "@/assets/logo-completa.png.asset.json";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const resetMutation = useMutation({
    mutationFn: (vars: { email: string }) => requestPasswordReset({ data: vars }),
    onSuccess: (data) => {
      setSubmitted(true);
      toast.success("Solicitação enviada");
    },
    onError: (error: any) => {
      // Even on error, we might want to show the generic message if it's an enumeration risk
      toast.error(error.message || "Erro ao processar solicitação");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetMutation.mutate({ email });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 bg-black/40 p-10 border border-white/5 rounded-sm text-center">
          <div className="flex justify-center">
            <img src={logoAsset.url} alt="064 TALENTS" className="h-16 w-auto object-contain" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-widest italic">Verifique seu E-mail</h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Se existir uma conta associada a <span className="text-white">{email}</span>, você receberá instruções para redefinir sua senha em instantes.
          </p>
          <button 
            onClick={() => navigate({ to: "/auth" })}
            className="w-full bg-white text-black py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition mt-6"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 bg-black/40 p-10 border border-white/5 rounded-sm">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <img src={logoAsset.url} alt="064 TALENTS" className="h-16 w-auto object-contain" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">Recuperação de Acesso</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">E-mail da Conta</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu-email@dominio.com"
              className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition text-sm" 
              required
            />
          </div>
          <button 
            type="submit"
            disabled={resetMutation.isPending}
            className="w-full bg-white text-black py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition disabled:opacity-50"
          >
            {resetMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processando...
              </span>
            ) : "Redefinir Senha"}
          </button>
        </form>
        
        <div className="text-center pt-4">
            <button 
              onClick={() => navigate({ to: "/auth" })}
              className="text-[10px] uppercase tracking-widest text-neutral-600 hover:text-white transition flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-3 h-3" />
              Voltar ao Login
            </button>
        </div>
      </div>
    </div>
  );
}
