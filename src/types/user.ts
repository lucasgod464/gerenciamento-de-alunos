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
  address?: string;
  specialization?: string;
  tags?: { id: string; name: string; color: string; }[];
  authorizedRooms?: { id: string; name: string; }[];
  specializations?: { id: string; name: string; }[];
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyId: string;
  accessLevel: AccessLevel;
  location?: string;
  address?: string;
  specialization?: string;
  status?: UserStatus;
  selectedRooms?: string[];
  selectedTags?: { id: string; name: string; color: string; }[];
  selectedSpecializations?: string[];
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
  location?: string;
  address?: string;
  specialization?: string;
  user_tags?: { tags: { id: string; name: string; color: string; } }[];
  user_rooms?: { rooms: { id: string; name: string; } }[];
  user_specializations?: { specializations: { id: string; name: string; } }[];
}

export const mapSupabaseUser = (user: UserResponse): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role === "ADMIN" ? "ADMIN" : "USER",
  companyId: user.company_id,
  createdAt: user.created_at,
  lastAccess: user.last_access,
  status: user.status ? "active" : "inactive",
  accessLevel: user.access_level,
  location: user.location,
  address: user.address,
  specialization: user.specialization,
  updatedAt: user.updated_at,
  tags: user.user_tags?.map(ut => ut.tags) || [],
  authorizedRooms: user.user_rooms?.map(ur => ur.rooms) || [],
  specializations: user.user_specializations?.map(us => us.specializations) || []
});