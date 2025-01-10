export type FieldType = 
  | "text" 
  | "email" 
  | "tel" 
  | "textarea" 
  | "date" 
  | "select" 
  | "multiple";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  description?: string;
  required: boolean;
  order: number;
  options?: string[];
  source: "admin" | "enrollment";
}

export interface SupabaseFormField {
  id: string;
  name: string;
  label: string;
  type: string;
  description?: string;
  required: boolean;
  order: number;
  options?: string[];
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
  required: field.required,
  order: field.order,
  options: Array.isArray(field.options) ? field.options : undefined,
  source: field.form_type as "admin" | "enrollment"
});