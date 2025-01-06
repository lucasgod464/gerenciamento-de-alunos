import { FormField } from "@/types/form";

export const defaultFields: FormField[] = [
  {
    id: "nome_completo",
    name: "nome_completo",
    label: "Nome Completo",
    type: "text",
    required: true,
    order: 0,
    options: [],
    source: "public",
    isDefault: true
  },
  {
    id: "data_nascimento",
    name: "data_nascimento",
    label: "Data de Nascimento",
    type: "date",
    required: true,
    order: 1,
    options: [],
    source: "public",
    isDefault: true
  }
];