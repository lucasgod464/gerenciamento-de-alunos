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
  tags: { id: string; name: string; color: string }[];
  authorizedRooms: { id: string; name: string }[];
  specializations: { id: string; name: string }[];
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
  access_level: UserAccessLevel;
  location?: string;
  specialization?: string;
  address?: string;
  updated_at: string;
  user_tags?: {
    tags: {
      id: string;
      name: string;
      color: string;
    };
  }[];
  user_rooms?: {
    rooms: {
      id: string;
      name: string;
    };
  }[];
  user_specializations?: {
    specializations: {
      id: string;
      name: string;
    };
  }[];
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  accessLevel: UserAccessLevel;
  companyId: string;
  location?: string;
  specialization?: string;
  status?: UserStatus;
  address?: string;
  selectedRooms?: string[];
  selectedTags?: { id: string; name: string; color: string }[];
  selectedSpecializations?: string[];
}

export const mapSupabaseUser = (data: UserResponse): User => ({
  id: data.id,
  name: data.name,
  email: data.email,
  role: data.role as UserRole,
  companyId: data.company_id,
  createdAt: data.created_at,
  lastAccess: data.last_access,
  status: data.status ? "active" : "inactive",
  accessLevel: data.access_level,
  location: data.location,
  specialization: data.specialization,
  address: data.address,
  updatedAt: data.updated_at,
  tags: data.user_tags?.map(ut => ut.tags) || [],
  authorizedRooms: data.user_rooms?.map(ur => ur.rooms) || [],
  specializations: data.user_specializations?.map(us => us.specializations) || []
});