export type FieldType = 'text' | 'email' | 'tel' | 'select' | 'multiple' | 'textarea';

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
  description: string;
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