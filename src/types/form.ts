export type FieldType = 'text' | 'number' | 'email' | 'tel' | 'date' | 'select' | 'multiple' | 'checkbox' | 'radio' | 'textarea';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  description?: string | null;
  required: boolean;
  order: number;
  options?: string[];
  company_id?: string | null;
  created_at?: string;
}

export interface SupabaseFormField {
  id: string;
  name: string;
  label: string;
  type: string;
  description: string | null;
  required: boolean;
  order: number;
  options: any;
  company_id: string | null;
  created_at: string;
}

export const mapSupabaseFormField = (field: SupabaseFormField): FormField => {
  return {
    ...field,
    type: field.type as FieldType,
    options: Array.isArray(field.options) ? field.options.map(String) : undefined
  };
};