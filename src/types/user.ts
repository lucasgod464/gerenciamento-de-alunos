import { Json } from "@/integrations/supabase/types";

export type AccessLevel = "Admin" | "Usuário Comum";
export type UserStatus = "active" | "inactive";

export interface User {
  id: string;
  name: string;
  email: string;
  companyId: string;
  createdAt: string;
  lastAccess: string;
  status: UserStatus;
  accessLevel: AccessLevel;
  location?: string | null;
  specialization?: string | null;
  address?: string | null;
  tags: { id: string; name: string; color: string; }[];
  authorizedRooms: { id: string; name: string; }[];
}

export interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  role: string;
  company_id: string;
  created_at: string;
  last_access: string;
  status: string;
  access_level: AccessLevel;
  location: string | null;
  specialization: string | null;
  address: string | null;
  password: string;
}

export const mapDatabaseUser = (dbUser: DatabaseUser): User => ({
  id: dbUser.id,
  name: dbUser.name,
  email: dbUser.email,
  companyId: dbUser.company_id,
  createdAt: dbUser.created_at,
  lastAccess: dbUser.last_access,
  status: dbUser.status as UserStatus,
  accessLevel: dbUser.access_level,
  location: dbUser.location,
  specialization: dbUser.specialization,
  address: dbUser.address,
  tags: [],
  authorizedRooms: []
});