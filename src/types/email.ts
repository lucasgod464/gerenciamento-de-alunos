export interface Email {
  id: string;
  name: string;
  email: string;
  access_level: "Admin" | "Usuário Comum";
  company_id?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}