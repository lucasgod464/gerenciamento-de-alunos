import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .optional()
    .or(z.literal("")),
  location: z.string().min(2, "Local deve ter pelo menos 2 caracteres"),
  specialization: z.string().min(1, "Selecione uma especialização"),
  status: z.enum(["active", "inactive"], {
    required_error: "Selecione um status",
  }),
  authorizedRooms: z.array(z.string()).min(1, "Selecione pelo menos uma sala"),
  responsibleCategory: z.string().min(1, "Selecione uma categoria"),
});

export type UserFormData = z.infer<typeof userSchema>;