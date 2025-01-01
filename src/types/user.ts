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
  tags: string[];
  responsibleCategory?: string;
  location?: string;
  specialization?: string;
  status?: 'active' | 'inactive';
  phone?: string;
  birthDate?: string;
  address?: string;
}