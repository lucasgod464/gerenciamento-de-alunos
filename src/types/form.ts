export type FieldType = 'text' | 'number' | 'date' | 'select' | 'multiple' | 'phone' | 'email';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  description?: string;
  required?: boolean;
  order: number;
  options?: string[];
}

export interface CustomField {
  id: string;
  name: string;
  value: string;
  type: FieldType;
}

export interface SupabaseFormField {
  id: string;
  name: string;
  label: string;
  type: string;
  description?: string;
  required?: boolean;
  order: number;
  options?: string[];
  company_id?: string;
  created_at?: string;
}

export const mapSupabaseFormField = (field: SupabaseFormField): FormField => ({
  id: field.id,
  name: field.name,
  label: field.label,
  type: field.type as FieldType,
  description: field.description,
  required: field.required,
  order: field.order,
  options: field.options
});

export const mapFormFieldToSupabase = (field: Omit<FormField, 'id' | 'order'>): Omit<SupabaseFormField, 'id' | 'order'> => ({
  name: field.name,
  label: field.label,
  type: field.type,
  description: field.description,
  required: field.required,
  options: field.options
});