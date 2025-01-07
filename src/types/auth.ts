export type UserRole = 'ADMIN' | 'USER' | 'SUPER_ADMIN';
export type UserStatus = 'active' | 'inactive';
export type UserAccessLevel = 'Admin' | 'Usuário Comum';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  createdAt: string;
  lastAccess: string;
  status: UserStatus;
  accessLevel: UserAccessLevel;
}

export interface User extends AuthUser {
  password?: string;
  location?: string;
  specialization?: string;
  address?: string;
  tags?: { id: string; name: string; color: string }[];
  authorizedRooms?: { id: string; name: string }[];
  specializations?: { id: string; name: string }[];
}