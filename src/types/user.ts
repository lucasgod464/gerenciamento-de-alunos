export type UserStatus = 'active' | 'inactive';
export type AccessLevel = 'Admin' | 'Usuário Comum' | 'Inativo';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  company_id: string | null;
  created_at: string | null;
  last_access: string | null;
  status: UserStatus;
  access_level: AccessLevel;
  location?: string | null;
  specialization?: string | null;
  authorizedRooms?: string[];
  tags?: { id: string; name: string; color: string; }[];
  responsibleCategory?: string;
}