import { Json } from "@/integrations/supabase/types";

export interface Student {
  id: string;
  name: string;
  birthDate: string | null;
  status: boolean;
  email: string | null;
  document: string | null;
  address: string | null;
  customFields: Record<string, string> | null;
  companyId: string | null;
  createdAt: string;
  room?: string | null;
}

export interface SupabaseStudent {
  id: string;
  name: string;
  birth_date: string | null;
  status: boolean;
  email: string | null;
  document: string | null;
  address: string | null;
  custom_fields: Json | null;
  company_id: string | null;
  created_at: string;
}

export function mapSupabaseStudentToStudent(student: SupabaseStudent): Student {
  return {
    id: student.id,
    name: student.name,
    birthDate: student.birth_date,
    status: student.status,
    email: student.email,
    document: student.document,
    address: student.address,
    customFields: student.custom_fields as Record<string, string> | null,
    companyId: student.company_id,
    createdAt: student.created_at,
  };
}