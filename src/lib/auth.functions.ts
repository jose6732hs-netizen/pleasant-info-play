import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const AUTH_STORAGE_KEY = "064_auth_session";

export const loginAdmin = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    email: z.string().email(),
    password: z.string().min(6)
  }).parse(data))
  .handler(async ({ data }) => {
    // In a real app with Supabase enabled, we would use supabase.auth.signInWithPassword
    // Since Cloud is disabled, we implement a persistent mock login for the first account
    if (data.email === "sempreteste552@gmail.com" && data.password === "Kaique@321") {
      return { 
        success: true, 
        user: { id: "admin-1", email: data.email, role: "admin" },
        token: "mock-jwt-token-064"
      };
    }
    
    throw new Error("Não foi possível realizar o login. Verifique suas credenciais.");
  });

export const checkAuth = createServerFn({ method: "GET" })
  .handler(async () => {
    // Server-side check would normally verify the session cookie/JWT
    return { authenticated: true }; 
  });

export const requestPasswordReset = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    email: z.string().email()
  }).parse(data))
  .handler(async ({ data }) => {
    // In a real app, check if user exists, generate token, send email
    // To avoid user enumeration, always return generic success message
    console.log(`Password reset requested for: ${data.email}`);
    return { success: true, message: "Se existir uma conta associada a este e-mail, você receberá instruções para redefinir sua senha." };
  });

export const resetPassword = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    token: z.string(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
  }).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"]
  }).parse(data))
  .handler(async ({ data }) => {
    // Verify token, update password in DB, invalidate token
    console.log(`Password reset with token: ${data.token}`);
    return { success: true };
  });
