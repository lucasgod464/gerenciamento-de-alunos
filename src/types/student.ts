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
  custom_fields: Json;
  company_id: string;
  created_at: string;
  room_students?: { room_id: string }[];
}

export const mapSupabaseStudentToStudent = (student: SupabaseStudent): Student => {
  return {
    id: student.id,
    name: student.name,
    birthDate: student.birth_date,
    status: student.status ?? true,
    email: student.email || null,
    document: student.document || null,
    address: student.address || null,
    customFields: student.custom_fields as Record<string, any> || {},
    companyId: student.company_id,
    createdAt: student.created_at,
    room: student.room_students?.[0]?.room_id || null
  };
};

export const mapStudentToSupabase = (student: Student): Omit<SupabaseStudent, 'id' | 'created_at'> => {
  return {
    name: student.name,
    birth_date: student.birthDate,
    status: student.status,
    email: student.email,
    document: student.document,
    address: student.address,
    custom_fields: student.customFields,
    company_id: student.companyId,
  };
};