export interface Student {
  id: string;
  name: string;
  birthDate: string;
  status: boolean;
  email: string | null;
  document: string | null;
  address: string | null;
  customFields: Record<string, any>;
  companyId: string;
  createdAt: string;
  room?: string | null;
}

export interface SupabaseStudent {
  id: string;
  name: string;
  birth_date: string;
  status: boolean;
  email: string | null;
  document: string | null;
  address: string | null;
  custom_fields: Record<string, any>;
  company_id: string;
  created_at: string;
  room_students?: { room_id: string }[];
}

export const mapSupabaseStudentToStudent = (student: SupabaseStudent): Student => ({
  id: student.id,
  name: student.name,
  birthDate: student.birth_date,
  status: student.status,
  email: student.email,
  document: student.document,
  address: student.address,
  customFields: student.custom_fields || {},
  companyId: student.company_id,
  createdAt: student.created_at,
  room: student.room_students?.[0]?.room_id || null
});