export type AccessLevel = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: AccessLevel;
  companyId: string | null; // null for SUPER_ADMIN
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

// Helper type to define what each role can do
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