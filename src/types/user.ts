export type UserStatus = 'active' | 'inactive';
export type UserRole = 'ADMIN' | 'USER' | 'SUPER_ADMIN';
export type AccessLevel = 'Admin' | 'Usuário Comum';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  companyId?: string;
  createdAt?: string;
  lastAccess?: string;
  status: UserStatus;
  location?: string;
  address?: string;
  specialization?: string;
  accessLevel?: AccessLevel;
  tags?: { id: string; name: string; color: string; }[];
  authorizedRooms?: { id: string; name: string; }[];
  specializations?: { id: string; name: string; }[];
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  companyId?: string;
  status?: UserStatus;
  location?: string;
  address?: string;
  specialization?: string;
  accessLevel?: AccessLevel;
}