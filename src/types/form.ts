export type FieldType = 'text' | 'email' | 'tel' | 'textarea' | 'date' | 'select' | 'multiple';
export type FormSource = 'admin' | 'enrollment' | 'public';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  description?: string;
  required: boolean;
  order: number;
  options?: string[];
  source: FormSource;
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
  form_type: string;
}

export const mapSupabaseFormField = (field: SupabaseFormField): FormField => ({
  id: field.id,
  name: field.name,
  label: field.label,
  type: field.type as FieldType,
  description: field.description || "",
  required: field.required,
  order: field.order,
  options: Array.isArray(field.options) ? field.options.map(String) : [],
  source: field.form_type as FormSource
});

export const mapFormFieldToSupabase = (field: FormField): Omit<SupabaseFormField, 'created_at'> => ({
  id: field.id,
  name: field.name,
  label: field.label,
  type: field.type,
  description: field.description || null,
  required: field.required,
  order: field.order,
  options: field.options || [],
  company_id: '', // Será preenchido no momento da inserção
  form_type: field.source
});