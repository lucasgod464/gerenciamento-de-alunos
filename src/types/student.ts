import { Json } from "@/integrations/supabase/types";
import { CustomField } from "./form";

export interface Student {
  id: string;
  name: string;
  birth_date: string;
  status: boolean;
  email: string | null;
  document: string | null;
  address: string | null;
  custom_fields: Record<string, CustomField>;
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
  room_students?: { room_id: string }[];
}

export const mapSupabaseStudentToStudent = (student: SupabaseStudent): Student => {
  let customFields: Record<string, CustomField> = {};
  
  if (student.custom_fields && typeof student.custom_fields === 'object') {
    customFields = Object.entries(student.custom_fields).reduce((acc, [key, value]) => {
      if (value && typeof value === 'object' && 'fieldName' in value) {
        acc[key] = value as CustomField;
      }
      return acc;
    }, {} as Record<string, CustomField>);
  }

  return {
    id: student.id,
    name: student.name,
    birth_date: student.birth_date,
    status: student.status,
    email: student.email,
    document: student.document,
    address: student.address,
    custom_fields: customFields,
    company_id: student.company_id,
    created_at: student.created_at,
    room: student.room_students?.[0]?.room_id,
  };
};