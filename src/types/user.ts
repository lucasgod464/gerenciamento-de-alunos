export type AccessLevel = "Admin" | "Usuário Comum";
export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string | null;
  createdAt: string | null;
  lastAccess: string | null;
  status: "active" | "inactive";
  accessLevel: AccessLevel;
  location?: string;
  specialization?: string;
  address?: string;
  tags?: { id: string; name: string; color: string; }[];
  authorizedRooms?: { id: string; name: string; }[];
}

export interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company_id: string | null;
  created_at: string | null;
  last_access: string | null;
  status: "active" | "inactive";
  access_level: AccessLevel;
  location?: string;
  specialization?: string;
  address?: string;
  password: string;
  updated_at?: string;
}

export const mapDatabaseUser = (dbUser: DatabaseUser): User => ({
  id: dbUser.id,
  name: dbUser.name,
  email: dbUser.email,
  role: dbUser.role,
  companyId: dbUser.company_id,
  createdAt: dbUser.created_at,
  lastAccess: dbUser.last_access,
  status: dbUser.status,
  accessLevel: dbUser.access_level,
  location: dbUser.location,
  specialization: dbUser.specialization,
  address: dbUser.address,
  tags: [],
  authorizedRooms: []
});