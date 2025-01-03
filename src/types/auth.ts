export type AccessLevel = "Admin" | "Usuário Comum" | "Inativo";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  companyId: string | null;
  accessLevel: AccessLevel;
}