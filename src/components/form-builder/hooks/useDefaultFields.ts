import { FormField } from "../types";

export const defaultFields: FormField[] = [
  {
    id: "nome_completo",
    name: "nome_completo",
    label: "Nome Completo",
    type: "text",
    required: true,
    order: 0,
  },
  {
    id: "data_nascimento",
    name: "data_nascimento",
    label: "Data de Nascimento",
    type: "date",
    required: true,
    order: 1,
  },
  {
    id: "sala",
    name: "sala",
    label: "Sala",
    type: "select",
    required: true,
    order: 2,
  },
  {
    id: "status",
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    order: 3,
    options: ["Ativo", "Inativo"]
  }
];