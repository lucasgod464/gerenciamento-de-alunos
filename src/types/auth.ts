export type AccessLevel = 'Admin' | 'Usuário Comum' | 'Inativo';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string | null;
  createdAt: string;
  lastAccess: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}