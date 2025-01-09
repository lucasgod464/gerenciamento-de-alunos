export type FormSource = "admin" | "enrollment" | "public";

export type FieldType = "text" | "number" | "select" | "multiple" | "date" | "phone" | "email" | "tel" | "textarea";

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
  options: string[] | null;
  company_id: string;
  created_at: string;
  form_type: string;
}

export const mapSupabaseFormField = (field: SupabaseFormField): FormField => ({
  id: field.id,
  name: field.name,
  label: field.label,
  type: field.type as FieldType,
  description: field.description || undefined,
  required: field.required,
  order: field.order,
  options: field.options ? field.options.map(String) : undefined,
  source: field.form_type as FormSource
});

export const mapFormFieldToSupabase = (field: FormField): Omit<SupabaseFormField, 'id' | 'created_at' | 'company_id'> => ({
  name: field.name,
  label: field.label,
  type: field.type,
  description: field.description || null,
  required: field.required,
  order: field.order,
  options: field.options || null,
  form_type: field.source
});