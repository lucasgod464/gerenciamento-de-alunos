export interface Student {
  id: string;
  name: string;
  birthDate: string;
  room: string;
  status: 'active' | 'inactive';
  createdAt: string;
  companyId: string | null;
}