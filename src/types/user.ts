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

export const mapSupabaseUser = (data: any): User => ({
  id: data.id,
  name: data.name || '',
  email: data.email,
  role: data.role as UserRole,
  companyId: data.company_id || null,
  createdAt: data.created_at,
  lastAccess: data.last_access || new Date().toISOString(),
  status: data.status === 'active' ? 'active' : 'inactive',
  accessLevel: data.access_level || 'Usuário Comum',
  location: data.location,
  specialization: data.specialization,
  address: data.address,
  tags: data.tags,
  authorizedRooms: data.authorized_rooms,
  specializations: data.specializations
});