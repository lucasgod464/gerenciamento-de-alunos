import { Json } from "@/integrations/supabase/types";

export interface Student {
  id: string;
  name: string;
  birth_date: string;
  status: boolean;
  email: string | null;
  document: string | null;
  address: string | null;
  custom_fields: Record<string, {
    fieldName: string;
    label: string;
    value: any;
    type: string;
  }>;
  company_id: string;
  created_at: string;
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
  birth_date: student.birth_date,
  status: student.status,
  email: student.email,
  document: student.document,
  address: student.address,
  custom_fields: student.custom_fields as Record<string, {
    fieldName: string;
    label: string;
    value: any;
    type: string;
  }> || {},
  company_id: student.company_id,
  created_at: student.created_at,
});