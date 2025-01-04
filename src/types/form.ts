import { Json } from "@/integrations/supabase/types";

export type FieldType = 
  | "text"
  | "number"
  | "email"
  | "phone"
  | "tel"
  | "date"
  | "select"
  | "multiple"
  | "textarea";

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
  description?: string;
  required: boolean;
  order: number;
  options?: Json;
  company_id?: string;
  created_at?: string;
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
    options: Array.isArray(field.options) ? field.options : [],
    isDefault: false
  };
};

export const mapFormFieldToSupabase = (field: Omit<FormField, "id" | "order">): Omit<SupabaseFormField, "id" | "order"> => {
  return {
    name: field.name,
    label: field.label,
    type: field.type,
    description: field.description,
    required: field.required,
    options: field.options || []
  };
};