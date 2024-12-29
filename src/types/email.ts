export interface Email {
  id: string;
  name: string;
  email: string;
  password?: string;  // Mantendo password opcional
  accessLevel: "Admin" | "Usuário Comum";
  company: string;
  createdAt: string;
}