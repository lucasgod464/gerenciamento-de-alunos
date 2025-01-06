import { Json } from "@/integrations/supabase/types";

export type FieldType = "text" | "textarea" | "select" | "multiple" | "date" | "tel" | "email";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  description?: string;
  required: boolean;
  order: number;
  options?: string[];
  formType: 'admin' | 'enrollment';
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
  company_id?: string;
  created_at: string;
  form_type: string;
}

export const mapSupabaseFormField = (field: SupabaseFormField): FormField => ({
  id: field.id,
  name: field.name,
  label: field.label,
  type: field.type as FieldType,
  description: field.description,
  required: field.required,
  order: field.order,
  options: Array.isArray(field.options) ? field.options.map(opt => String(opt)) : [],
  formType: field.form_type as 'admin' | 'enrollment',
});

export const mapFormFieldToSupabase = (field: FormField): Omit<SupabaseFormField, 'id' | 'created_at'> => ({
  name: field.name,
  label: field.label,
  type: field.type,
  description: field.description,
  required: field.required,
  order: field.order,
  options: field.options?.map(opt => opt as Json) || [],
  company_id: undefined,
  form_type: field.formType,
});