export type AccessLevel = 'Admin' | 'Usuário Comum' | 'Inativo';

export interface User {
  id: string;
  name: string;
  email: string;
  role: AccessLevel;
  companyId: string | null;
  createdAt: string;
  lastAccess: string;
  profilePicture?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AccessControl {
  companyId: string;
  accessLevel: AccessLevel;
  permissions: string[];
}

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

export const ROLE_PERMISSIONS: Record<AccessLevel, RolePermissions> = {
  'Admin': {
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
  'Usuário Comum': {
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
  'Inativo': {
    canCreateCompany: false,
    canCreateAdmin: false,
    canCreateUser: false,
    canViewAllCompanies: false,
    canManageUsers: false,
    canManageRooms: false,
    canManageStudies: false,
    canManageTags: false,
    canManageSpecializations: false,
  }
};