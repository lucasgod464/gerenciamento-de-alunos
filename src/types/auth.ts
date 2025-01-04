export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  companyId: string | null;
  createdAt: string | null;
  lastAccess: string | null;
  accessLevel: "Admin" | "Usuário Comum";
}