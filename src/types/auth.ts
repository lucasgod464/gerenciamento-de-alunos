export type AccessLevel = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: AccessLevel;
  companyId: string | null; // null para SUPER_ADMIN
  createdAt: string;
  lastAccess: string;
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