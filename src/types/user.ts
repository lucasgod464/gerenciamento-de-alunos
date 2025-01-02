export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  company_id: string | null;
  created_at: string | null;
  last_access: string | null;
  authorizedRooms: string[];
  tags: { id: string; name: string; color: string; }[];
  responsibleCategory?: string;
  location?: string;
  specialization?: string;
  status: UserStatus;
  phone?: string;
  birthDate?: string;
  address?: string;
  user_tags?: any[];
}