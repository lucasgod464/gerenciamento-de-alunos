export type AccessLevel = "Admin" | "Usuário Comum";

export interface Email {
  id: string;
  name: string;
  email: string;
  password: string;
  accessLevel: AccessLevel;
  companyId: string;
  location?: string | null;
  specialization?: string | null;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    name: string;
    status: string;
  };
}

export interface SupabaseEmail {
  id: string;
  name: string;
  email: string;
  password: string;
  access_level: AccessLevel;
  company_id: string;
  location: string | null;
  specialization: string | null;
  created_at: string;
  updated_at: string;
  companies: {
    id: string;
    name: string;
    status: string;
  };
}

export function mapSupabaseEmailToEmail(email: SupabaseEmail): Email {
  return {
    id: email.id,
    name: email.name,
    email: email.email,
    password: email.password,
    accessLevel: email.access_level,
    companyId: email.company_id,
    location: email.location,
    specialization: email.specialization,
    createdAt: email.created_at,
    updatedAt: email.updated_at,
    company: email.companies
  };
}