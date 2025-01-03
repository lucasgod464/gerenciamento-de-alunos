export type FieldType = "text" | "email" | "tel" | "textarea" | "date" | "select" | "multiple";

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