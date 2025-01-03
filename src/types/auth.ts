export type AccessLevel = "Admin" | "Usuário Comum";

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

export type Permission = 
  | "create:user"
  | "edit:user"
  | "delete:user"
  | "view:users"
  | "manage:rooms"
  | "view:reports";

export type UserStatus = "active" | "inactive";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
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

export const ROLE_PERMISSIONS: Record<UserRole, Record<Permission, boolean>> = {
  SUPER_ADMIN: {
    "create:user": true,
    "edit:user": true,
    "delete:user": true,
    "view:users": true,
    "manage:rooms": true,
    "view:reports": true,
  },
  ADMIN: {
    "create:user": true,
    "edit:user": true,
    "delete:user": false,
    "view:users": true,
    "manage:rooms": true,
    "view:reports": true,
  },
  USER: {
    "create:user": false,
    "edit:user": false,
    "delete:user": false,
    "view:users": false,
    "manage:rooms": false,
    "view:reports": true,
  },
};