export type AccessLevel = "Admin" | "Usuário Comum";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string | null;
  createdAt: string | null;
  lastAccess: string | null;
  status: boolean;
  accessLevel: AccessLevel;
  location?: string;
  specialization?: string;
  address?: string;
  tags?: { id: string; name: string; color: string; }[];
  authorizedRooms?: { id: string; name: string; }[];
}

export interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  role: string;
  company_id: string | null;
  created_at: string | null;
  last_access: string | null;
  status: boolean;
  access_level: AccessLevel;
  location?: string;
  specialization?: string;
  address?: string;
  password: string;
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
  accessLevel: dbUser.access_level,
  location: dbUser.location,
  specialization: dbUser.specialization,
  address: dbUser.address
});

export const mapUserToDatabase = (user: User): Partial<DatabaseUser> => ({
  name: user.name,
  email: user.email,
  role: user.role,
  company_id: user.companyId,
  status: user.status,
  access_level: user.accessLevel,
  location: user.location,
  specialization: user.specialization,
  address: user.address
});