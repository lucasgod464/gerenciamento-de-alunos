import { Json } from "@/integrations/supabase/types";

export type FieldType = "text" | "email" | "tel" | "select" | "multiple" | "textarea" | "date";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  description?: string;
  required: boolean;
  order: number;
  options?: string[];
  company_id?: string;
  created_at?: string;
  isDefault?: boolean;
}

export interface SupabaseFormField {
  id: string;
  name: string;
  label: string;
  type: string;
  description?: string;
  required: boolean;
  order: number;
  options: Json[];
  company_id: string;
  created_at: string;
}

export const mapSupabaseFormField = (field: SupabaseFormField): FormField => ({
  id: field.id,
  name: field.name,
  label: field.label,
  type: field.type as FieldType,
  description: field.description,
  required: field.required,
  order: field.order,
  options: field.options?.map(opt => String(opt)),
  company_id: field.company_id,
  created_at: field.created_at
});

export const mapFormFieldToSupabase = (field: FormField): Omit<SupabaseFormField, 'id'> => ({
  name: field.name,
  label: field.label,
  type: field.type,
  description: field.description,
  required: field.required,
  order: field.order,
  options: field.options?.map(opt => opt as Json) || [],
  company_id: field.company_id || '',
  created_at: field.created_at || new Date().toISOString()
});