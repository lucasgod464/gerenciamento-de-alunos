export interface Email {
  id: string;
  name: string;
  email: string;
  password?: string;  // Tornando password opcional
  accessLevel: "Administrador" | "Usuário Comum";
  company: string;
  createdAt: string;
}