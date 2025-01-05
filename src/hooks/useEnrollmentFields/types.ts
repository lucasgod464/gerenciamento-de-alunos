import { FormField } from "@/types/form";

export interface UseEnrollmentFieldsProps {
  fields: FormField[];
  addField: (field: Omit<FormField, "id" | "order">) => Promise<void>;
  deleteField: (id: string) => Promise<void>;
  updateField: (field: FormField) => Promise<void>;
  reorderFields: (fields: FormField[]) => Promise<void>;
}