export type UserRole = 'ADMIN' | 'USER' | 'SUPER_ADMIN';
export type UserStatus = 'active' | 'inactive';
export type AccessLevel = 'Admin' | 'Usuário Comum';

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
  specialization?: string;
  address?: string;
  tags?: { id: string; name: string; color: string; }[];
  authorizedRooms?: { id: string; name: string; }[];
  specializations?: { id: string; name: string; }[];
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  accessLevel: AccessLevel;
  companyId: string;
  location?: string;
  specialization?: string;
  status: string;
  selectedRooms?: string[];
  selectedTags?: { id: string; name: string; color: string; }[];
  selectedSpecializations?: string[];
  address?: string;
}

export const mapSupabaseUser = (data: any): User => ({
  id: data.id,
  name: data.name || '',
  email: data.email,
  role: data.access_level === 'Admin' ? 'ADMIN' : 'USER',
  companyId: data.company_id,
  createdAt: data.created_at,
  lastAccess: data.updated_at,
  status: data.status === 'active' ? 'active' : 'inactive',
  accessLevel: data.access_level || 'Usuário Comum',
  location: data.location || '',
  specialization: data.specialization || '',
  address: data.address || '',
  tags: data.tags || [],
  authorizedRooms: data.authorizedRooms || [],
  specializations: data.specializations || []
});