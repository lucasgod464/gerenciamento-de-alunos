export type FormFieldType = "text" | "email" | "tel" | "select" | "multiple";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
  description?: string;
  required: boolean;
  order: number;
  options?: string[];
}

export interface FormFieldWithValue extends FormField {
  value: string | string[];
}

export interface FormFieldGroup {
  id: string;
  fields: FormField[];
}