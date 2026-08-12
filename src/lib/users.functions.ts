import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { logAuditEvent } from "./audit.functions";

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'BLOCKED';
  createdAt: string;
  lastAccess: string;
}

// Mock initial data
let users: User[] = [
  {
    id: "admin-1",
    name: "Administrador Geral",
    email: "sempreteste552@gmail.com",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "2026-01-01T10:00:00Z",
    lastAccess: new Date().toISOString()
  }
];

export const getUsers = createServerFn({ method: "GET" })
  .handler(async () => {
    return users;
  });

export const createUser = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    name: z.string().min(2),
    email: z.string().email(),
    role: z.enum(['ADMIN', 'USER'])
  }).parse(data))
  .handler(async ({ data }) => {
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      ...data,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      lastAccess: '-'
    };
    users = [...users, newUser];
    
    await logAuditEvent({
      data: {
        type: 'USER_CREATED',
        userEmail: data.email,
        result: 'SUCCESS',
        metadata: { role: data.role }
      }
    });

    return newUser;
  });

export const updateUserStatus = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    id: z.string(),
    status: z.enum(['ACTIVE', 'BLOCKED'])
  }).parse(data))
  .handler(async ({ data }) => {
    const user = users.find(u => u.id === data.id);
    users = users.map(u => u.id === data.id ? { ...u, status: data.status } : u);
    
    await logAuditEvent({
      data: {
        type: data.status === 'BLOCKED' ? 'USER_BLOCKED' : 'USER_UNBLOCKED',
        userEmail: user?.email,
        result: 'SUCCESS',
        metadata: { userId: data.id }
      }
    });

    return { success: true };
  });

export const updateUserRole = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    id: z.string(),
    role: z.enum(['ADMIN', 'USER'])
  }).parse(data))
  .handler(async ({ data }) => {
    users = users.map(u => u.id === data.id ? { ...u, role: data.role } : u);
    return { success: true };
  });

export const deleteUser = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    id: z.string()
  }).parse(data))
  .handler(async ({ data }) => {
    users = users.filter(u => u.id !== data.id);
    return { success: true };
  });
