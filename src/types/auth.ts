export type UserRole = 'ADMIN' | 'USER' | 'SUPER_ADMIN';
export type UserStatus = 'active' | 'inactive';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string | null;
  accessLevel: 'Admin' | 'Usuário Comum';
  createdAt: string;
  lastAccess: string;
  status: UserStatus;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface DatabaseUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company_id: string;
  access_level: 'Admin' | 'Usuário Comum';
  created_at: string;
  last_access: string;
  status: UserStatus;
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

export const mapDatabaseUser = (user: DatabaseUser): AuthUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  companyId: user.company_id,
  accessLevel: user.access_level,
  createdAt: user.created_at,
  lastAccess: user.last_access,
  status: user.status || 'active'
});