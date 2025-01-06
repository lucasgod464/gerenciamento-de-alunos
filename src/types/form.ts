import { Json } from "@/integrations/supabase/types";

export type FormFieldType = 'text' | 'number' | 'date' | 'select' | 'multiple' | 'phone';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
  description?: string;
  required: boolean;
  order: number;
  options: string[];
  source: 'admin' | 'public';
}

export interface SupabaseFormField {
  id: string;
  name: string;
  label: string;
  type: string;
  description?: string;
  required: boolean;
  order: number;
  options: Json[];
  company_id?: string;
  created_at: string;
  form_type: 'admin' | 'enrollment';
}

export const mapSupabaseFormField = (field: SupabaseFormField): FormField => ({
  id: field.id,
  name: field.name,
  label: field.label,
  type: field.type as FormFieldType,
  description: field.description,
  required: field.required || false,
  order: field.order,
  options: Array.isArray(field.options) ? field.options.map(String) : [],
  source: field.form_type === 'admin' ? 'admin' : 'public'
});

export const mapFormFieldToSupabase = (field: Omit<FormField, 'id' | 'order'>): Omit<SupabaseFormField, 'id' | 'created_at'> => ({
  name: field.name,
  label: field.label,
  type: field.type,
  description: field.description,
  required: field.required,
  order: 0, // Será definido ao inserir
  options: field.options,
  form_type: field.source === 'admin' ? 'admin' : 'enrollment'
});

// Re-exportando o tipo para compatibilidade
export type FieldType = FormFieldType;