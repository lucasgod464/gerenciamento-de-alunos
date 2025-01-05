import { Json } from "@/integrations/supabase/types";

export type FieldType = "text" | "email" | "tel" | "textarea" | "date" | "select" | "multiple";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  description?: string;
  required: boolean;
  order: number;
  options?: string[];
}

export interface SupabaseFormField {
  id: string;
  name: string;
  label: string;
  type: string;
  description: string | null;
  required: boolean | null;
  order: number;
  options: Json[] | null;
  company_id: string;
  created_at: string;
}

export const mapSupabaseFormField = (field: SupabaseFormField): FormField => ({
  id: field.id,
  name: field.name,
  label: field.label,
  type: field.type as FieldType,
  description: field.description || undefined,
  required: field.required || false,
  order: field.order,
  options: field.options ? field.options.map(opt => String(opt)) : undefined
});

export const mapFormFieldToSupabase = (field: FormField): Omit<SupabaseFormField, 'id' | 'created_at'> => ({
  name: field.name,
  label: field.label,
  type: field.type,
  description: field.description || null,
  required: field.required,
  order: field.order,
  options: field.options ? field.options.map(opt => opt as Json) : null,
  company_id: ''
});