import { Json } from "./supabase";

export type FieldType = "text" | "number" | "date" | "select" | "textarea" | "checkbox" | "radio" | "phone" | "email" | "tel" | "multiple";

export type FormFieldSource = "admin" | "enrollment" | "public" | "custom";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
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
  options: string[] | null;
  company_id?: string;
  created_at: string;
  form_type: string;
}

export const mapSupabaseFormField = (field: SupabaseFormField): FormField => {
  return {
    id: field.id,
    name: field.name,
    label: field.label,
    type: field.type as FieldType,
    description: field.description,
    required: field.required,
    order: field.order,
    options: field.options || undefined,
    source: field.form_type as FormFieldSource,
    isDefault: false
  };
};

export const mapFormFieldToSupabase = (field: Omit<FormField, "id">): Omit<SupabaseFormField, "id" | "created_at"> => {
  return {
    name: field.name,
    label: field.label,
    type: field.type,
    description: field.description,
    required: field.required,
    order: field.order,
    options: field.options || null,
    form_type: field.source
  };
};