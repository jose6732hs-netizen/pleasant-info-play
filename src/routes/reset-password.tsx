import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { resetPassword } from "@/lib/auth.functions";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import logoAsset from "@/assets/logo-completa.png.asset.json";
import { z } from "zod";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>) => {
    return z.object({
      token: z.string().optional(),
    }).parse(search);
  },
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useSearch({ from: "/reset-password" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const passwordStrength = (pw: string) => {
    if (pw.length === 0) return 0;
    let strength = 0;
    if (pw.length >= 8) strength += 25;
    if (/[A-Z]/.test(pw)) strength += 25;
    if (/[0-9]/.test(pw)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pw)) strength += 25;
    return strength;
  };

  const strength = passwordStrength(password);

  const resetMutation = useMutation({
    mutationFn: (vars: any) => resetPassword({ data: vars }),
    onSuccess: () => {
      toast.success("Senha redefinida com sucesso!");
      navigate({ to: "/auth" });
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao redefinir senha");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Token de redefinição inválido ou ausente.");
      return;
    }
    resetMutation.mutate({ token, password, confirmPassword });
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 bg-black/40 p-10 border border-white/5 rounded-sm text-center">
           <h2 className="text-xl font-bold uppercase tracking-widest text-red-500">Link Inválido</h2>
           <p className="text-sm text-neutral-400">Este link de redefinição é inválido ou expirou.</p>
           <button onClick={() => navigate({ to: "/forgot-password" })} className="w-full bg-white text-black py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition">Solicitar Novo Link</button>
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
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">Nova Senha de Acesso</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Nova Senha</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition text-sm pr-12" 
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            <div className="pt-2 space-y-2">
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    strength <= 25 ? 'bg-red-500' : 
                    strength <= 50 ? 'bg-orange-500' : 
                    strength <= 75 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${strength}%` }}
                />
              </div>
              <p className="text-[8px] uppercase tracking-widest text-neutral-600 font-bold flex items-center gap-2">
                <ShieldCheck className="w-2.5 h-2.5" />
                Segurança: {
                  strength <= 25 ? 'Fraca' : 
                  strength <= 50 ? 'Média' : 
                  strength <= 75 ? 'Boa' : 'Excelente'
                }
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Confirmar Nova Senha</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-white transition text-sm" 
              required
            />
          </div>

          <button 
            type="submit"
            disabled={resetMutation.isPending || strength < 75}
            className="w-full bg-white text-black py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition disabled:opacity-50"
          >
            {resetMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Atualizando...
              </span>
            ) : "Salvar Nova Senha"}
          </button>
          
          {strength < 75 && password.length > 0 && (
            <p className="text-[9px] text-orange-500 uppercase tracking-widest text-center">Use letras maiúsculas, números e símbolos.</p>
          )}
        </form>
      </div>
    </div>
  );
}
