export type FieldType = "text" | "email" | "tel" | "textarea" | "date" | "select" | "multiple" | "checkbox";

export interface FormField {
  id: string;
  name: string;
  label: string;
  description?: string | null;
  type: FieldType;
  required: boolean;
  order: number;
  options?: string[] | null;
  company_id?: string | null;
  created_at?: string;
}

export interface SupabaseFormField {
  id: string;
  name: string;
  label: string;
  description: string | null;
  type: string;
  required: boolean;
  order: number;
  options: any[] | null;
  company_id: string | null;
  created_at: string;
}

export function mapSupabaseFormField(field: SupabaseFormField): FormField {
  return {
    ...field,
    type: field.type as FieldType,
    options: Array.isArray(field.options) 
      ? field.options.map(opt => String(opt))
      : null
  };
}