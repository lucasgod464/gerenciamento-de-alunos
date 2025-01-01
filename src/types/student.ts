export interface Student {
  id: string;
  name: string;
  birthDate: string;
  email?: string;
  document?: string;
  address?: string;
  room: string;
  status: 'active' | 'inactive';
  createdAt: string;
  companyId: string | null;
  customFields?: Record<string, string>;
}