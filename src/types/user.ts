export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string | null;
  createdAt: string | null;
  lastAccess: string | null;
  status: boolean;
  accessLevel: "Admin" | "Usuário Comum";
  location?: string;
  specialization?: string;
  tags?: { id: string; name: string; color: string; }[];
}

export interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  role: string;
  company_id: string;
  created_at: string;
  last_access: string | null;
  status: boolean;
  access_level: "Admin" | "Usuário Comum";
  location?: string;
  specialization?: string;
  password: string;
}

export const mapDatabaseUser = (dbUser: any): User => ({
  id: dbUser.id,
  name: dbUser.name,
  email: dbUser.email,
  role: dbUser.access_level,
  companyId: dbUser.company_id,
  createdAt: dbUser.created_at,
  lastAccess: dbUser.last_access,
  status: dbUser.status === 'active',
  accessLevel: dbUser.access_level,
  location: dbUser.location,
  specialization: dbUser.specialization,
  tags: dbUser.user_tags?.map((ut: any) => ut.tag) || [],
});