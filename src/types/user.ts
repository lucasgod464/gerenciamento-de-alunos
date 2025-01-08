export type UserRole = 'ADMIN' | 'USER' | 'SUPER_ADMIN';
export type UserStatus = 'active' | 'inactive';
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
  tags: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  authorizedRooms: Array<{
    id: string;
    name: string;
  }>;
  specializations: Array<{
    id: string;
    name: string;
  }>;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  accessLevel: UserAccessLevel;
  companyId: string;
  location?: string;
  specialization?: string;
  address?: string;
  selectedRooms?: string[];
  selectedTags?: string[];
  selectedSpecializations?: string[];
  status?: UserStatus;
}

export const mapSupabaseUser = (data: any): User => ({
  id: data.id,
  name: data.name,
  email: data.email,
  role: data.access_level === 'Admin' ? 'ADMIN' : 'USER',
  companyId: data.company_id,
  createdAt: data.created_at,
  lastAccess: data.updated_at || data.created_at,
  status: data.status === 'active' ? 'active' : 'inactive',
  accessLevel: data.access_level || 'Usuário Comum',
  location: data.location || '',
  specialization: data.specialization || '',
  address: data.address || '',
  tags: data.tags || [],
  authorizedRooms: data.authorizedRooms || [],
  specializations: data.specializations || []
});