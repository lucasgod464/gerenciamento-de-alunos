export interface Email {
  id: string;
  name: string;
  email: string;
  password: string;
  accessLevel: "Administrador" | "Usuário Comum";
  company: string;
  createdAt: string;
}