export type UserRole = 'ADMIN' | 'USER' | 'SUPER_ADMIN';
export type UserStatus = 'active' | 'inactive';
export type AccessLevel = "Admin" | "Usuário Comum";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string;
  location?: string | null;
  specialization?: string | null;
  createdAt: string;
  updatedAt: string;
  lastAccess: string | null;
  status: UserStatus;
  accessLevel: AccessLevel;
  authorizedRooms?: string[];
  tags?: { id: string; name: string; color: string; }[];
  company?: {
    id: string;
    name: string;
    status: string;
  };
}

export function mapDatabaseUser(dbUser: any): User {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
    companyId: dbUser.company_id,
    location: dbUser.location,
    specialization: dbUser.specialization,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at || dbUser.created_at,
    lastAccess: dbUser.last_access,
    status: dbUser.status,
    accessLevel: dbUser.access_level,
    authorizedRooms: dbUser.authorizedRooms,
    tags: dbUser.tags,
    company: dbUser.company ? {
      id: dbUser.company.id,
      name: dbUser.company.name,
      status: dbUser.company.status,
    } : undefined,
  };
}