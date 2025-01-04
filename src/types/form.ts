import { Json } from "@/integrations/supabase/types";

export type FieldType = "text" | "email" | "tel" | "date" | "textarea" | "select" | "multiple";

export interface CustomField {
  fieldId: string;
  fieldName: string;
  label: string;
  value: any;
  type: string;
}

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

export interface SupabaseFormField {
  id: string;
  name: string;
  label: string;
  type: string;
  description: string | null;
  required: boolean | null;
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
  required: field.required ?? false,
  order: field.order,
  options: field.options ? (field.options as string[]) : undefined,
});

export const mapFormFieldToSupabase = (field: FormField): Partial<SupabaseFormField> => ({
  name: field.name,
  label: field.label,
  type: field.type,
  description: field.description || null,
  required: field.required || false,
  options: field.options || null,
  order: field.order,
});