export type DatabaseAccessLevel = "Admin" | "Usuário Comum";

export interface Email {
  id: string;
  name: string;
  email: string;
  password?: string;
  accessLevel: DatabaseAccessLevel;
  company: string;
  companyId: string;
  companyStatus: "Ativa" | "Inativa";
  createdAt: string;
}

export interface SupabaseEmail {
  id: string;
  name: string;
  email: string;
  password: string;
  access_level: DatabaseAccessLevel;
  company_id: string;
  created_at: string;
  updated_at: string;
  companies: {
    id: string;
    name: string;
    status: string;
  };
}

export function mapSupabaseEmailToEmail(supabaseEmail: SupabaseEmail): Email {
  return {
    id: supabaseEmail.id,
    name: supabaseEmail.name,
    email: supabaseEmail.email,
    password: supabaseEmail.password,
    accessLevel: supabaseEmail.access_level,
    company: supabaseEmail.companies?.name || '',
    companyId: supabaseEmail.company_id,
    companyStatus: supabaseEmail.companies?.status as "Ativa" | "Inativa",
    createdAt: new Date(supabaseEmail.created_at).toLocaleDateString(),
  };
}