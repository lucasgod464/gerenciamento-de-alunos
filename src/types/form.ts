import { Json } from "@/integrations/supabase/types";

export type FieldType = "text" | "number" | "date" | "select" | "multiple" | "phone" | "email" | "tel" | "textarea";
export type FieldSource = "admin" | "enrollment" | "public";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  description?: string;
  required: boolean;
  order: number;
  options?: string[];
  source: FieldSource;
  form_type?: string;
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
  options?: Json;
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
  options: Array.isArray(field.options) ? field.options.map(String) : undefined,
  source: field.form_type === 'enrollment' ? 'enrollment' : field.form_type === 'admin' ? 'admin' : 'public',
  form_type: field.form_type,
  isDefault: false
});

export const mapFormFieldToSupabase = (field: FormField): Omit<SupabaseFormField, "id" | "created_at"> => ({
  name: field.name,
  label: field.label,
  type: field.type,
  description: field.description,
  required: field.required,
  order: field.order,
  options: field.options,
  form_type: field.form_type || 'admin'
});