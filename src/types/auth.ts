export type UserRole = "Admin" | "Usuário Comum";
export type UserStatus = "active" | "inactive";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  createdAt: string;
  lastAccess: string;
  status: UserStatus;
  accessLevel: UserRole;
  location?: string;
  specialization?: string;
  address?: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  error: Error | null;
}

export interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company_id: string;
  created_at: string;
  last_access: string;
  status: UserStatus;
  access_level: UserRole;
  location?: string;
  specialization?: string;
  address?: string;
  password: string;
}

export const mapDatabaseUser = (dbUser: DatabaseUser): AuthUser => ({
  id: dbUser.id,
  name: dbUser.name,
  email: dbUser.email,
  role: dbUser.role,
  companyId: dbUser.company_id,
  createdAt: dbUser.created_at,
  lastAccess: dbUser.last_access,
  status: dbUser.status as UserStatus,
  accessLevel: dbUser.access_level,
  location: dbUser.location,
  specialization: dbUser.specialization,
  address: dbUser.address
});

export type Permission = "read" | "write" | "delete" | "admin";