import { Json } from "./supabase";

export type FormFieldType = 'text' | 'number' | 'email' | 'tel' | 'select' | 'multiple' | 'date' | 'textarea';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
  description?: string;
  required: boolean;
  order: number;
  options?: string[];
  source?: 'admin' | 'public';
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
  company_id: string;
  created_at: string;
  form_type: 'admin' | 'enrollment';
}

export const mapSupabaseFormField = (field: any): FormField => ({
  id: field.id,
  name: field.name,
  label: field.label,
  type: field.type as FormFieldType,
  description: field.description || undefined,
  required: field.required || false,
  order: field.order,
  options: Array.isArray(field.options) ? field.options.map(String) : [],
  source: field.form_type === 'admin' ? 'admin' : 'public'
});

export const mapFormFieldToSupabase = (field: FormField): Omit<SupabaseFormField, 'id' | 'created_at'> => ({
  name: field.name,
  label: field.label,
  type: field.type,
  description: field.description || null,
  required: field.required,
  order: field.order,
  options: field.options || [],
  company_id: undefined as any, // será definido no momento da inserção
  form_type: field.source === 'admin' ? 'admin' : 'enrollment'
});