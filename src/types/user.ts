export type AccessLevel = "Admin" | "Usuário Comum" | "Inativo";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string;
  createdAt: string;
  lastAccess?: string;
  status: 'active' | 'inactive';
  accessLevel: AccessLevel;
  location?: string;
  specialization?: string;
  address?: string;
  tags?: { id: string; name: string; color: string; }[];
  authorizedRooms?: { id: string; name: string; }[];
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
  access_level: AccessLevel;
  location?: string;
  specialization?: string;
  address?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  access_level: AccessLevel;
  company_id: string;
}