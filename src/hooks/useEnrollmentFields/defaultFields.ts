import { FormField } from "@/types/form";
import { v4 as uuidv4 } from "uuid";

export const defaultFields: FormField[] = [
  {
    id: uuidv4(),
    name: "nome_completo",
    label: "Nome Completo",
    type: "text",
    required: true,
    order: 0,
    isDefault: true
  },
  {
    id: uuidv4(),
    name: "data_nascimento",
    label: "Data de Nascimento",
    type: "date",
    required: true,
    order: 1,
    isDefault: true
  }
];