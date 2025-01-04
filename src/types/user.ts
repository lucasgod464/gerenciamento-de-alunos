export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string | null;
  createdAt: string;
  lastAccess: string | null;
  status: boolean;
  location?: string;
  specialization?: string;
  accessLevel: "Admin" | "Usuário Comum";
  authorizedRooms?: string[];
}

export interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  role: string;
  company_id: string | null;
  created_at: string;
  last_access: string | null;
  status: boolean;
  location?: string;
  specialization?: string;
  access_level: "Admin" | "Usuário Comum";
}

export const mapDatabaseUser = (dbUser: DatabaseUser): User => ({
  id: dbUser.id,
  name: dbUser.name,
  email: dbUser.email,
  role: dbUser.role,
  companyId: dbUser.company_id,
  createdAt: dbUser.created_at,
  lastAccess: dbUser.last_access,
  status: dbUser.status,
  location: dbUser.location,
  specialization: dbUser.specialization,
  accessLevel: dbUser.access_level,
});

export type AccessLevel = "Admin" | "Usuário Comum";