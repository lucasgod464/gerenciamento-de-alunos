export type UserRole = 'ADMIN' | 'USER' | 'SUPER_ADMIN';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  createdAt: string;
  lastAccess: string;
  status: UserStatus;
  accessLevel: 'Admin' | 'Usuário Comum';
  location?: string;
  specialization?: string;
  address?: string;
  tags?: { id: string; name: string; color: string; }[];
  authorizedRooms?: { id: string; name: string; }[];
}

export interface SupabaseUser {
  id: string;
  name: string;
  email: string;
  role: string;
  company_id: string;
  created_at: string;
  last_access: string;
  status: string;
  access_level: 'Admin' | 'Usuário Comum';
  location?: string;
  specialization?: string;
  address?: string;
}

export const mapSupabaseUser = (user: SupabaseUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role as UserRole,
  companyId: user.company_id,
  createdAt: user.created_at,
  lastAccess: user.last_access,
  status: user.status as UserStatus,
  accessLevel: user.access_level,
  location: user.location,
  specialization: user.specialization,
  address: user.address,
});