export type UserRole = 'ADMIN' | 'USER' | 'SUPER_ADMIN';
export type UserStatus = 'active' | 'inactive';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string | null;
  createdAt: string;
  lastAccess: string;
  status: UserStatus;
}

export interface AuthResponse {
  user: AuthUser;
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

export const ROLE_PERMISSIONS = {
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
} as const;