export type UserStatus = "active" | "inactive";
export type AccessLevel = "Admin" | "Usuário Comum";

export interface User {
  id: string;
  name: string;
  email: string;
  accessLevel: AccessLevel;
  companyId: string;
  location?: string;
  specialization?: string;
  status: UserStatus;
  address?: string;
  createdAt: string;
  updatedAt: string;
  tags?: Array<{ id: string; name: string; color: string }>;
  authorizedRooms?: Array<{ id: string; name: string }>;
  specializations?: Array<{ id: string; name: string }>;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  accessLevel: AccessLevel;
  companyId: string;
  location?: string;
  specialization?: string;
  status?: UserStatus;
  address?: string;
  selectedRooms?: string[];
  selectedTags?: Array<{ id: string }>;
  selectedSpecializations?: string[];
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  access_level: AccessLevel;
  company_id: string;
  location: string | null;
  specialization: string | null;
  status: string;
  address: string | null;
  created_at: string;
  updated_at: string;
  user_tags?: Array<{
    tags: { id: string; name: string; color: string };
  }>;
  user_rooms?: Array<{
    rooms: { id: string; name: string };
  }>;
  user_specializations?: Array<{
    specializations: { id: string; name: string };
  }>;
}

export const mapSupabaseUser = (user: UserResponse): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  accessLevel: user.access_level,
  companyId: user.company_id,
  location: user.location || undefined,
  specialization: user.specialization || undefined,
  status: user.status as UserStatus,
  address: user.address || undefined,
  createdAt: user.created_at,
  updatedAt: user.updated_at,
  tags: user.user_tags?.map(ut => ut.tags),
  authorizedRooms: user.user_rooms?.map(ur => ur.rooms),
  specializations: user.user_specializations?.map(us => us.specializations)
});