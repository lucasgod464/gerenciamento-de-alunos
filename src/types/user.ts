export type UserStatus = 'active' | 'inactive';
export type AccessLevel = 'Usuário Comum' | 'Admin' | 'Inativo';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company_id: string | null;
  created_at: string | null;
  last_access: string | null;
  authorizedRooms: string[];
  tags: { id: string; name: string; color: string; }[];
  status: UserStatus;
  access_level?: AccessLevel;
  password: string;
  location?: string;
  specialization?: string;
}