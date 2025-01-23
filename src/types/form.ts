import { Json } from "@/integrations/supabase/types";

export type FieldType = "text" | "email" | "tel" | "textarea" | "date" | "select" | "multiple" | "phone";
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
  isDefault?: boolean;
}

export interface SupabaseFormField {
  id: string;
  name: string;
  label: string;
  type: string;
  description: string | null;
  required: boolean;
  order: number;
  options: Json | null;
  company_id?: string;
  created_at: string;
  form_type: string;
}

export const mapSupabaseFormField = (field: SupabaseFormField): FormField => ({
  id: field.id,
  name: field.name,
  label: field.label,
  type: field.type as FieldType,
  description: field.description || undefined,
  required: field.required,
  order: field.order,
  options: field.options ? (Array.isArray(field.options) ? field.options.map(String) : [String(field.options)]) : undefined,
  source: field.form_type as FieldSource,
  isDefault: false
});

export const mapFormFieldToSupabase = (field: FormField): Omit<SupabaseFormField, 'id' | 'created_at'> => ({
  name: field.name,
  label: field.label,
  type: field.type,
  description: field.description || null,
  required: field.required,
  order: field.order,
  options: field.options || null,
  form_type: field.source
});