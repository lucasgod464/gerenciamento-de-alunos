import { Json } from "@/integrations/supabase/types";

export type FormFieldType = 'text' | 'email' | 'tel' | 'select' | 'multiple' | 'textarea' | 'date';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
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
  options?: Json[];
  company_id?: string;
  created_at?: string;
}

export const mapSupabaseFormField = (field: SupabaseFormField): FormField => ({
  id: field.id,
  name: field.name,
  label: field.label,
  type: field.type as FormFieldType,
  description: field.description,
  required: field.required,
  order: field.order,
  options: field.options?.map(opt => String(opt)) || [],
});

export const mapFormFieldToSupabase = (field: FormField): Omit<SupabaseFormField, 'id'> => ({
  name: field.name,
  label: field.label,
  type: field.type,
  description: field.description,
  required: field.required,
  order: field.order,
  options: field.options,
});