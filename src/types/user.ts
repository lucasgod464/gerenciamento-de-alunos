import { Json } from "./supabase";

export type AccessLevel = "Admin" | "Usuário Comum";

export interface User {
  id: string;
  name: string;
  email: string;
  accessLevel: AccessLevel;
  companyId: string;
  createdAt: string;
  lastAccess?: string;
  status: string;
  location?: string;
  specialization?: string;
  address?: string;
  tags?: { id: string; name: string; color: string; }[];
  authorizedRooms?: { id: string; name: string; }[];
  specializations?: { id: string; name: string; }[];
}

export interface DatabaseUser {
  id: string;
  email: string;
  name: string;
  role: string;
  company_id: string;
  created_at: string;
  last_access: string;
  status: boolean;
}

export const mapDatabaseUser = (data: any): User => ({
  id: data.id,
  name: data.name,
  email: data.email,
  accessLevel: data.access_level,
  companyId: data.company_id,
  createdAt: data.created_at,
  lastAccess: data.last_access,
  status: data.status,
  location: data.location || '',
  specialization: data.specialization || '',
  address: data.address || '',
  tags: data.tags || [],
  authorizedRooms: data.authorizedRooms || [],
  specializations: data.specializations || []
});