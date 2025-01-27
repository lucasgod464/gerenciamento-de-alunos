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
  lastAccess: string;
  status: UserStatus;
  accessLevel: AccessLevel;
  location?: string;
  address?: string;
  specialization?: string;
  updatedAt: string;
  tags?: { id: string; name: string; color: string; }[];
  authorizedRooms?: { id: string; name: string; }[];
  specializations?: { id: string; name: string; }[];
}

export interface SupabaseUser {
  id: string;
  name: string;
  email: string;
  role: string;
  company_id: string;
  created_at: string;
  last_access: string;
  status: boolean;
  access_level: AccessLevel;
  location?: string;
  address?: string;
  specialization?: string;
  updated_at: string;
}

export const mapSupabaseUser = (user: SupabaseUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role as UserRole,
  companyId: user.company_id,
  createdAt: user.created_at,
  lastAccess: user.last_access,
  status: user.status ? "active" : "inactive",
  accessLevel: user.access_level,
  location: user.location,
  address: user.address,
  specialization: user.specialization,
  updatedAt: user.updated_at,
});

export interface AuthUser extends User {
  accessToken?: string;
  refreshToken?: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  company_id: string;
  created_at: string;
  last_access: string;
  status: boolean;
  access_level: AccessLevel;
  updated_at: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyId: string;
  accessLevel: AccessLevel;
}