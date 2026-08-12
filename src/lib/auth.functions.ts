import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { logAuditEvent } from "./audit.functions";
import { getRequest } from "@tanstack/react-start/server";

const AUTH_STORAGE_KEY = "064_auth_session";

export const loginAdmin = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    email: z.string().email(),
    password: z.string().min(6)
  }).parse(data))
  .handler(async ({ data }) => {
    if (data.email === "sempreteste552@gmail.com" && data.password === "Kaique@321") {
      await logAuditEvent({
        data: {
          type: 'LOGIN_SUCCESS',
          userEmail: data.email,
          result: 'SUCCESS',
          metadata: { method: 'credentials' }
        }
      });

      // We'll return a cookie header for session management
      return { 
        success: true, 
        user: { id: "admin-1", email: data.email, role: "admin" },
        token: "mock-jwt-token-064"
      };
    }
    
    await logAuditEvent({
      data: {
        type: 'LOGIN_FAILURE',
        userEmail: data.email,
        result: 'FAILURE',
        metadata: { error: 'Invalid credentials' }
      }
    });

    throw new Error("Não foi possível realizar o login. Verifique suas credenciais.");
  });

export const checkAuth = createServerFn({ method: "GET" })
  .handler(async () => {
    const request = getRequest();
    
    // Check both Authorization header and cookie/localStorage-like token
    const authHeader = request?.headers.get("Authorization") || "";
    const cookieHeader = request?.headers.get("Cookie") || "";
    
    const token = authHeader.replace("Bearer ", "") || 
                 cookieHeader.split(';').find(c => c.trim().startsWith('064_auth_token='))?.split('=')[1] || 
                 "";
    
    // In a real app, verify JWT. Here we check our mock token.
    // We also allow an internal fallback for the preview environment if the header is missing but the intention is clear
    if (token === "mock-jwt-token-064") {
      return { authenticated: true, user: { id: "admin-1", role: "ADMIN" } };
    }
    
    return { authenticated: false }; 
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
