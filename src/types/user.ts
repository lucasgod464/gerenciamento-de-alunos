export type UserStatus = 'active' | 'inactive';
export type UserRole = 'ADMIN' | 'USER' | 'SUPER_ADMIN';
export type UserAccessLevel = 'Admin' | 'Usuário Comum';

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
  tags?: Array<{ id: string; name: string; color: string; }>;
  authorizedRooms?: Array<{ id: string; name: string; }>;
  specializations?: Array<{ id: string; name: string; }>;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  accessLevel: UserAccessLevel;
  companyId: string;
  location?: string;
  specialization?: string;
  status: UserStatus;
  address?: string;
  selectedRooms?: string[];
  selectedTags?: Array<{ id: string; name: string; color: string; }>;
  selectedSpecializations?: string[];
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  access_level: UserAccessLevel;
  company_id: string;
  created_at: string;
  updated_at: string;
  location: string | null;
  specialization: string | null;
  status: string;
  address: string | null;
  user_tags: {
    tags: {
      id: string;
      name: string;
      color: string;
    };
  }[];
  user_rooms: {
    rooms: {
      id: string;
      name: string;
    };
  }[];
  user_specializations: {
    specializations: {
      id: string;
      name: string;
    };
  }[];
}

export interface AuthUser extends User {
  accessLevel: UserAccessLevel;
}

export const mapSupabaseUser = (data: UserResponse): User => ({
  id: data.id,
  name: data.name,
  email: data.email,
  role: data.access_level === 'Admin' ? 'ADMIN' : 'USER',
  companyId: data.company_id,
  createdAt: data.created_at,
  lastAccess: data.updated_at,
  status: data.status === 'active' ? 'active' : 'inactive',
  accessLevel: data.access_level,
  location: data.location || '',
  specialization: data.specialization || '',
  address: data.address || '',
  tags: data.user_tags?.map(ut => ut.tags) || [],
  authorizedRooms: data.user_rooms?.map(ur => ur.rooms) || [],
  specializations: data.user_specializations?.map(us => us.specializations) || []
});