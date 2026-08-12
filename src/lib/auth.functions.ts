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
    
    throw new Error("Credenciais inválidas. Use o e-mail e senha padrão do sistema.");
  });

export const checkAuth = createServerFn({ method: "GET" })
  .handler(async () => {
    // Server-side check would normally verify the session cookie/JWT
    return { authenticated: true }; 
  });
