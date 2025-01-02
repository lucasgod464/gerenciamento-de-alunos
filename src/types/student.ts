export type StudentStatus = "active" | "inactive";

export interface Student {
  id: string;
  name: string;
  birthDate: string;
  room: string;
  status: StudentStatus;
  createdAt: string;
  companyId: string | null;
  email?: string;
  document?: string;
  address?: string;
  customFields?: Record<string, string>;
}

export interface SupabaseStudent {
  id: string;
  name: string;
  birth_date: string;
  status: boolean;
  created_at: string;
  email?: string;
  document?: string;
  address?: string;
  custom_fields?: Record<string, string>;
}

export function mapSupabaseStudentToStudent(supabaseStudent: SupabaseStudent, roomId: string, companyId: string | null): Student {
  return {
    id: supabaseStudent.id,
    name: supabaseStudent.name,
    birthDate: supabaseStudent.birth_date,
    room: roomId,
    status: supabaseStudent.status ? "active" : "inactive",
    createdAt: new Date(supabaseStudent.created_at).toLocaleDateString(),
    companyId,
    email: supabaseStudent.email,
    document: supabaseStudent.document,
    address: supabaseStudent.address,
    customFields: supabaseStudent.custom_fields
  };
}