export type AccessLevel = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

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