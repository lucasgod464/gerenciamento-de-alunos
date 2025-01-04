export type AccessLevel = "Admin" | "Usuário Comum";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  location?: string;
  specialization?: string;
  status?: string;
  accessLevel?: AccessLevel;
  authorizedRooms?: string[];
  tags?: { id: string; name: string; color: string; }[];
  lastAccess?: string;
}

interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  role: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  location?: string;
  specialization?: string;
  status?: string;
  access_level?: AccessLevel;
  last_access?: string;
}

export function mapDatabaseUser(user: DatabaseUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    companyId: user.company_id,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    location: user.location,
    specialization: user.specialization,
    status: user.status,
    accessLevel: user.access_level,
    lastAccess: user.last_access
  };
}