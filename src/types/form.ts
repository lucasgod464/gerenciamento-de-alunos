import { Json } from "@/integrations/supabase/types";

export type FieldType = 'text' | 'email' | 'tel' | 'select' | 'multiple' | 'textarea' | 'date';

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
  required: boolean;
  order: number;
  options: string[];
  company_id?: string;
  created_at?: string;
}

export interface CustomField {
  fieldId: string;
  fieldName: string;
  label: string;
  value: any;
  type: FieldType;
}

export const mapSupabaseFormField = (field: any): FormField => ({
  id: field.id,
  name: field.name,
  label: field.label,
  type: field.type as FieldType,
  description: field.description || undefined,
  required: field.required || false,
  order: field.order,
  options: Array.isArray(field.options) ? field.options : [],
});

export const mapFormFieldToSupabase = (field: Omit<FormField, 'id' | 'order'>): Omit<SupabaseFormField, 'id' | 'order'> => ({
  name: field.name,
  label: field.label,
  type: field.type,
  description: field.description || '',
  required: field.required,
  options: field.options || []
});