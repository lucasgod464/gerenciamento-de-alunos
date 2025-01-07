export interface Student {
  id: string;
  name: string;
  birthDate: string;
  status: boolean;
  email?: string;
  document?: string;
  address?: string;
  customFields: Record<string, any>;
  companyId: string;
  createdAt: string;
  room?: string;
}

export const mapSupabaseStudent = (data: any): Student => ({
  id: data.id,
  name: data.name,
  birthDate: data.birth_date,
  status: data.status,
  email: data.email,
  document: data.document,
  address: data.address,
  customFields: data.custom_fields || {},
  companyId: data.company_id,
  createdAt: data.created_at,
  room: data.room
});