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
    Object.entries(student.custom_fields as Record<string, any>).forEach(([key, value]) => {
      if (value && typeof value === 'object') {
        customFields[key] = {
          fieldId: value.fieldId || key,
          fieldName: value.fieldName || key,
          label: value.label || key,
          value: value.value,
          type: value.type || 'text'
        };
      }
    });
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

export const mapStudentToSupabase = (student: Partial<Student>): Partial<SupabaseStudent> => {
  const { room, ...rest } = student;
  return {
    ...rest,
    custom_fields: student.custom_fields ? JSON.parse(JSON.stringify(student.custom_fields)) : null,
  };
};