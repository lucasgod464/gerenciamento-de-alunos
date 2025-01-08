import { Json } from "@/integrations/supabase/types";

export type FormFieldType = 'text' | 'number' | 'email' | 'tel' | 'select' | 'multiple' | 'date' | 'textarea';
export type FormFieldSource = 'admin' | 'public' | 'system';
export type FormType = 'admin' | 'enrollment';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
  description?: string;
  required: boolean;
  order: number;
  options?: string[];
  source: FormFieldSource;
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
  form_type: FormType;
}

export const mapSupabaseFormField = (field: SupabaseFormField): FormField => ({
  id: field.id,
  name: field.name,
  label: field.label,
  type: field.type as FormFieldType,
  description: field.description || "",
  required: field.required || false,
  order: field.order,
  options: Array.isArray(field.options) ? field.options.map(String) : undefined,
  source: field.form_type === 'admin' ? 'admin' : 'public',
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
  form_type: field.source === 'admin' ? 'admin' : 'enrollment'
});