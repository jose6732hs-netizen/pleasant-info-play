import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type AuditEventType = 
  | 'LOGIN_SUCCESS' 
  | 'LOGIN_FAILURE' 
  | 'LOGOUT' 
  | 'PASSWORD_RESET_REQUEST' 
  | 'PASSWORD_RESET_SUCCESS' 
  | 'USER_CREATED' 
  | 'USER_BLOCKED' 
  | 'USER_UNBLOCKED' 
  | 'ROLE_CHANGED' 
  | 'ADMIN_ACCESS' 
  | 'UNAUTHORIZED_ACCESS_ATTEMPT';

export interface AuditLog {
  id: string;
  type: AuditEventType;
  userId?: string | undefined;
  userEmail?: string | undefined;
  timestamp: string;
  result: 'SUCCESS' | 'FAILURE';
  ip: string;
  metadata?: Record<string, any>;
}

// Memory-only store for the demo
let auditLogs: AuditLog[] = [
  {
    id: '1',
    type: 'ADMIN_ACCESS',
    userEmail: 'sempreteste552@gmail.com',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    result: 'SUCCESS',
    ip: '192.168.x.x',
    metadata: { path: '/admin' }
  }
];

export const logAuditEvent = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    type: z.string(),
    userId: z.string().optional(),
    userEmail: z.string().optional(),
    result: z.enum(['SUCCESS', 'FAILURE']),
    metadata: z.record(z.any()).optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substring(7),
      type: data.type as AuditEventType,
      userId: data.userId,
      userEmail: data.userEmail,
      timestamp: new Date().toISOString(),
      result: data.result,
      ip: '127.0.0.1', // Simplified for demo
      metadata: data.metadata
    };
    auditLogs = [newLog, ...auditLogs];
    return { success: true };
  });

export const getAuditLogs = createServerFn({ method: "GET" })
  .handler(async () => {
    // In a real app, we would verify ADMIN role here via context.supabase
    return auditLogs;
  });
