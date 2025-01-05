import { Json } from "@/integrations/supabase/types";

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

export interface SupabaseStudent {
  id: string;
  name: string;
  birth_date: string;
  status: boolean;
  email?: string;
  document?: string;
  address?: string;
  custom_fields: Json;
  company_id: string;
  created_at: string;
}

export const mapSupabaseStudent = (student: SupabaseStudent): Student => ({
  id: student.id,
  name: student.name,
  birthDate: student.birth_date,
  status: student.status,
  email: student.email,
  document: student.document,
  address: student.address,
  customFields: student.custom_fields as Record<string, any>,
  companyId: student.company_id,
  createdAt: student.created_at,
});

export const mapStudentToSupabase = (student: Student): Omit<SupabaseStudent, 'id' | 'created_at'> => ({
  name: student.name,
  birth_date: student.birthDate,
  status: student.status,
  email: student.email,
  document: student.document,
  address: student.address,
  custom_fields: student.customFields,
  company_id: student.companyId,
});

export const mapSupabaseStudentToStudent = mapSupabaseStudent;