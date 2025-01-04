import { Json } from "@/integrations/supabase/types";

export type FieldType = "text" | "email" | "tel" | "date" | "textarea" | "select" | "multiple";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  description?: string;
  required: boolean;
  order: number;
  options?: string[];
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
  options: Json | null;
  company_id: string | null;
  created_at: string;
}

export const mapSupabaseFormField = (field: SupabaseFormField): FormField => ({
  id: field.id,
  name: field.name,
  label: field.label,
  type: field.type as FieldType,
  description: field.description || undefined,
  required: field.required,
  order: field.order,
  options: field.options as string[] | undefined,
});

export const mapFormFieldToSupabase = (field: FormField): Partial<SupabaseFormField> => ({
  name: field.name,
  label: field.label,
  type: field.type,
  description: field.description || null,
  required: field.required,
  options: field.options || null,
  order: field.order,
});

export const defaultFields: FormField[] = [
  {
    id: "nome_completo",
    name: "nome_completo",
    label: "Nome Completo",
    type: "text",
    required: true,
    order: 0,
    isDefault: true
  },
  {
    id: "data_nascimento",
    name: "data_nascimento",
    label: "Data de Nascimento",
    type: "date",
    required: true,
    order: 1,
    isDefault: true
  },
  {
    id: "sala",
    name: "sala",
    label: "Sala",
    type: "select",
    required: true,
    order: 2,
    isDefault: true
  },
  {
    id: "status",
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    order: 3,
    options: ["Ativo", "Inativo"],
    isDefault: true
  }
];