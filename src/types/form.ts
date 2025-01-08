import { Json } from "@/integrations/supabase/types";

export type FieldType = 'text' | 'number' | 'date' | 'select' | 'multiple' | 'phone';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  description?: string;
  required: boolean;
  order: number;
  options?: string[];
  source: 'admin' | 'public' | 'system';
  isDefault?: boolean;
}

export interface SupabaseFormField {
  id: string;
  name: string;
  label: string;
  type: string;
  description: string;
  required: boolean;
  order: number;
  options: Json[];
  company_id: string;
  created_at: string;
  form_type: string;
}

export const mapSupabaseFormField = (field: SupabaseFormField): FormField => ({
  id: field.id,
  name: field.name,
  label: field.label,
  type: field.type as FieldType,
  description: field.description,
  required: field.required || false,
  order: field.order,
  options: Array.isArray(field.options) ? field.options.map(String) : undefined,
  source: field.form_type === 'admin' ? 'admin' : 'public',
  isDefault: false
});

export const mapFormFieldToSupabase = (field: FormField): Omit<SupabaseFormField, "id" | "created_at"> => ({
  name: field.name,
  label: field.label,
  type: field.type,
  description: field.description || '',
  required: field.required,
  order: field.order,
  options: field.options ? field.options.map(opt => opt as Json) : [],
  company_id: '',
  form_type: field.source === 'admin' ? 'admin' : 'public'
});