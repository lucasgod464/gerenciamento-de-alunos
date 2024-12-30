export type FieldType = "text" | "email" | "tel" | "textarea" | "date" | "select" | "multiple";

export interface FormField {
  id: string;
  name: string;
  label: string;
  description?: string;
  type: FieldType;
  required: boolean;
  order: number;
  options?: string[];
}