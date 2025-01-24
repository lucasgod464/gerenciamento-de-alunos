export type UserRole = "ADMIN" | "USER";
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
  address?: string;
  specialization?: string;
  updatedAt: string;
  tags?: { id: string; name: string; color: string; }[];
  authorizedRooms?: { id: string; name: string; }[];
  specializations?: { id: string; name: string; }[];
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  company_id: string;
  created_at: string;
  last_access: string;
  access_level: UserAccessLevel;
  status: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyId: string;
  status: UserStatus;
  accessLevel: UserAccessLevel;
  location?: string;
  address?: string;
  specialization?: string;
  selectedRooms?: string[];
  selectedTags?: { id: string; name: string; color: string; }[];
  selectedSpecializations?: string[];
}

export const mapUserResponse = (data: any): User => ({
  id: data.id,
  name: data.name,
  email: data.email,
  role: data.role as UserRole,
  companyId: data.company_id,
  createdAt: data.created_at,
  lastAccess: data.last_access,
  status: data.status === 'active' ? 'active' : 'inactive',
  accessLevel: data.access_level,
  location: data.location,
  address: data.address,
  specialization: data.specialization,
  updatedAt: data.updated_at || data.created_at,
  tags: data.tags,
  authorizedRooms: data.authorized_rooms,
  specializations: data.specializations
});