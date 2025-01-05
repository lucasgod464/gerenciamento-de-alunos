import { Json } from "./supabase";

export type FormFieldType = "text" | "email" | "tel" | "date" | "select" | "multiple" | "textarea";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
  description?: string;
  required?: boolean;
  order: number;
  options?: string[];
  isDefault?: boolean;
}

export interface SupabaseFormField {
  id: string;
  name: string;
  label: string;
  type: string;
  description?: string;
  required?: boolean;
  order: number;
  options?: string[];
  company_id?: string;
  created_at?: string;
}

export const mapSupabaseFormField = (field: {
  id: string;
  name: string;
  label: string;
  type: string;
  description?: string;
  required?: boolean;
  order: number;
  options?: Json;
  company_id?: string;
  created_at?: string;
}): FormField => ({
  id: field.id,
  name: field.name,
  label: field.label,
  type: field.type as FormFieldType,
  description: field.description,
  required: field.required,
  order: field.order,
  options: Array.isArray(field.options) ? field.options : undefined,
});

export const mapFormFieldToSupabase = (field: FormField): Omit<SupabaseFormField, 'id' | 'created_at'> => ({
  name: field.name,
  label: field.label,
  type: field.type,
  description: field.description,
  required: field.required,
  order: field.order,
  options: field.options,
});