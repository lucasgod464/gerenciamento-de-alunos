import { Json } from "@/integrations/supabase/types";

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
  room?: string;
}

export interface SupabaseStudent {
  id: string;
  name: string;
  birth_date: string;
  status: boolean;
  email: string | null;
  document: string | null;
  address: string | null;
  custom_fields: Json;
  company_id: string;
  created_at: string;
}

export const mapSupabaseStudentToStudent = (student: SupabaseStudent): Student => ({
  id: student.id,
  name: student.name,
  birthDate: student.birth_date,
  status: student.status,
  email: student.email,
  document: student.document,
  address: student.address,
  customFields: student.custom_fields as Record<string, any> || {},
  companyId: student.company_id,
  createdAt: student.created_at,
});