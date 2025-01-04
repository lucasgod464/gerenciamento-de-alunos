import { Json } from "@/integrations/supabase/types";

export type FieldType = "text" | "email" | "tel" | "date" | "textarea" | "select" | "multiple";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  description?: string;
  required: boolean;
  order: number;
  options?: string[];
  isDefault?: boolean;
}

export interface CustomField {
  name: string;
  value: string | string[];
  type: FieldType;
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
  company_id: string | null;
  created_at: string;
}

export const mapSupabaseFormField = (field: SupabaseFormField): FormField => ({
  id: field.id,
  name: field.name,
  label: field.label,
  type: field.type as FieldType,
  description: field.description || undefined,
  required: field.required,
  order: field.order,
  options: field.options as string[] | undefined,
});

export const mapFormFieldToSupabase = (field: Omit<FormField, "id" | "order">): Omit<SupabaseFormField, 'id' | 'created_at'> => ({
  name: field.name,
  label: field.label,
  type: field.type,
  description: field.description || null,
  required: field.required,
  options: field.options || null,
  order: 0, // Será definido ao inserir
  company_id: null
});