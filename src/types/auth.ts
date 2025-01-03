// Role types
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';
export type AccessLevel = 'Admin' | 'Usuário Comum' | 'Inativo';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string | null;
  createdAt: string;
  lastAccess: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export type Permission = 
  | 'canCreateCompany'
  | 'canCreateAdmin'
  | 'canCreateUser'
  | 'canViewAllCompanies'
  | 'canManageUsers'
  | 'canManageRooms'
  | 'canManageStudies'
  | 'canManageTags'
  | 'canManageSpecializations';

export interface RolePermissions {
  canCreateCompany: boolean;
  canCreateAdmin: boolean;
  canCreateUser: boolean;
  canViewAllCompanies: boolean;
  canManageUsers: boolean;
  canManageRooms: boolean;
  canManageStudies: boolean;
  canManageTags: boolean;
  canManageSpecializations: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  SUPER_ADMIN: {
    canCreateCompany: true,
    canCreateAdmin: true,
    canCreateUser: true,
    canViewAllCompanies: true,
    canManageUsers: true,
    canManageRooms: true,
    canManageStudies: true,
    canManageTags: true,
    canManageSpecializations: true,
  },
  ADMIN: {
    canCreateCompany: false,
    canCreateAdmin: false,
    canCreateUser: true,
    canViewAllCompanies: false,
    canManageUsers: true,
    canManageRooms: true,
    canManageStudies: true,
    canManageTags: true,
    canManageSpecializations: true,
  },
  USER: {
    canCreateCompany: false,
    canCreateAdmin: false,
    canCreateUser: false,
    canViewAllCompanies: false,
    canManageUsers: false,
    canManageRooms: false,
    canManageStudies: false,
    canManageTags: false,
    canManageSpecializations: false,
  },
};