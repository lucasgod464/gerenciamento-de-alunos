export type UserRole = "ADMIN" | "USER";
export type UserStatus = "active" | "inactive";
export type AccessLevel = "Admin" | "Usuário Comum";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  lastAccess: string;
  status: UserStatus;
  accessLevel: AccessLevel;
  location?: string;
  specialization?: string;
  address?: string;
  tags?: { id: string; name: string; color: string }[];
  authorizedRooms?: { id: string; name: string }[];
  specializations?: { id: string; name: string }[];
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyId: string;
  accessLevel: AccessLevel;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  last_access: string;
  status: string;
  access_level: string;
  location?: string;
  specialization?: string;
  address?: string;
}

export const mapSupabaseUser = (data: UserResponse): User => ({
  id: data.id,
  name: data.name,
  email: data.email,
  role: data.role as UserRole,
  companyId: data.company_id,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
  lastAccess: data.last_access,
  status: data.status as UserStatus,
  accessLevel: data.access_level as AccessLevel,
  location: data.location,
  specialization: data.specialization,
  address: data.address
});