export type FieldType = "text" | "email" | "tel" | "textarea" | "date" | "select";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  order: number;
  options?: { label: string; value: string }[];
}