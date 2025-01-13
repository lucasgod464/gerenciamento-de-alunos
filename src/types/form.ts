import { Json } from "./supabase";

export type FieldType = 
  | "text" 
  | "email" 
  | "tel" 
  | "textarea" 
  | "date" 
  | "select" 
  | "multiple";

export type FieldSource = "admin" | "public" | "enrollment";

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
  company_id: string;
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
  form_type: field.form_type
});

export const mapFormFieldToSupabase = (field: FormField): Omit<SupabaseFormField, "id" | "created_at"> => ({
  name: field.name,
  label: field.label,
  type: field.type,
  description: field.description,
  required: field.required,
  order: field.order,
  options: field.options || null,
  company_id: "", // Será preenchido no momento da inserção
  form_type: field.source
});
