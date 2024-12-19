export type FieldType =
  | "text"
  | "number"
  | "date"
  | "email"
  | "tel"
  | "select"
  | "checkbox"
  | "radio"
  | "textarea"
  | "file";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  order: number;
  isDefault?: boolean;
  companyId?: string | null;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}