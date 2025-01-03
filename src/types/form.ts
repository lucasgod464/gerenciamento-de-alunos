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
}

export interface SupabaseFormField {
  id: string;
  name: string;
  label: string;
  type: string;
  description: string | null;
  required: boolean;
  order: number;
  options: Json[] | null;
  company_id: string | null;
  created_at: string;
}

export const mapSupabaseFormField = (field: SupabaseFormField): FormField => {
  return {
    id: field.id,
    name: field.name,
    label: field.label,
    type: field.type as FieldType,
    description: field.description || undefined,
    required: field.required,
    order: field.order,
    options: field.options ? field.options.map(opt => String(opt)) : undefined,
  };
};