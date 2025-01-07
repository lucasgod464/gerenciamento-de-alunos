export type UserRole = 'ADMIN' | 'USER' | 'SUPER_ADMIN';
export type UserStatus = 'active' | 'inactive';
export type UserAccessLevel = 'Admin' | 'Usuário Comum';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

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
  tags?: { id: string; name: string; color: string }[];
  authorizedRooms?: { id: string; name: string }[];
  specializations?: { id: string; name: string }[];
}

export interface User extends AuthUser {
  password?: string;
  location?: string;
  specialization?: string;
  address?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    { id: '1', name: 'canCreateCompany', description: 'Pode criar empresas' },
    { id: '2', name: 'canCreateAdmin', description: 'Pode criar administradores' },
    { id: '3', name: 'canViewAllCompanies', description: 'Pode ver todas as empresas' }
  ],
  ADMIN: [
    { id: '4', name: 'canManageUsers', description: 'Pode gerenciar usuários' },
    { id: '5', name: 'canManageRooms', description: 'Pode gerenciar salas' }
  ],
  USER: []
};