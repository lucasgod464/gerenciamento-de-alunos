export type UserRole = "ADMIN" | "USER" | "SUPER_ADMIN";
export type UserStatus = "active" | "inactive";
export type UserAccessLevel = "Admin" | "Usuário Comum";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  createdAt: string;
  lastAccess: string;
  status: UserStatus;
  accessLevel: UserAccessLevel;
  location?: string;
  specialization?: string;
  address?: string;
  updatedAt: string;
  tags?: { id: string; name: string; color: string }[];
  authorizedRooms?: { id: string; name: string }[];
  specializations?: { id: string; name: string }[];
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  company_id: string;
  created_at: string;
  last_access: string;
  status: boolean;
  access_level: UserAccessLevel;
  location?: string;
  specialization?: string;
  address?: string;
  updated_at: string;
}

export const mapUserResponse = (response: UserResponse): User => ({
  id: response.id,
  email: response.email,
  name: response.name,
  role: response.role as UserRole,
  companyId: response.company_id,
  createdAt: response.created_at,
  lastAccess: response.last_access,
  status: response.status ? "active" : "inactive",
  accessLevel: response.access_level,
  location: response.location,
  specialization: response.specialization,
  address: response.address,
  updatedAt: response.updated_at
});