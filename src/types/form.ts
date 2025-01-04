export type FieldType = 
  | "text"
  | "number"
  | "email"
  | "phone"
  | "date"
  | "select"
  | "multiple"
  | "textarea";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  description?: string;
  required: boolean;
  order: number;
  options?: string[];
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
}

export const mapSupabaseFormField = (field: SupabaseFormField): FormField => {
  return {
    ...field,
    type: field.type as FieldType,
    options: Array.isArray(field.options) ? field.options : []
  };
};