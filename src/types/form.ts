export type FormSource = "admin" | "enrollment" | "public";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "multiple" | "phone";
  description?: string;
  required: boolean;
  order: number;
  options?: string[];
  source: FormSource;
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
  company_id: string;
  created_at: string;
  form_type: string;
}

export const mapSupabaseFormField = (field: SupabaseFormField): FormField => ({
  id: field.id,
  name: field.name,
  label: field.label,
  type: field.type as FormField["type"],
  description: field.description,
  required: field.required,
  order: field.order,
  options: Array.isArray(field.options) ? field.options : [],
  source: field.form_type as FormSource
});