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
  access_level: AccessLevel;
  location?: string;
  specialization?: string;
  address?: string;
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
  role: UserRole;
  companyId: string;
  accessLevel: AccessLevel;
  location?: string;
  specialization?: string;
  status?: string;
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
  updatedAt: data.updated_at,
  lastAccess: data.last_access,
  status: data.status as UserStatus,
  accessLevel: data.access_level,
  location: data.location,
  specialization: data.specialization,
  address: data.address,
  tags: data.user_tags?.map(ut => ut.tags) || [],
  authorizedRooms: data.user_rooms?.map(ur => ur.rooms) || [],
  specializations: data.user_specializations?.map(us => us.specializations) || []
});