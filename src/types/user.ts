export type AccessLevel = "Admin" | "Usuário Comum";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string | null;
  createdAt: string | null;
  lastAccess: string | null;
  status: string;
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
  company_id: string;
  created_at: string;
  last_access: string | null;
  status: string;
  access_level: AccessLevel;
  location?: string;
  specialization?: string;
  address?: string;
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
  status: dbUser.status,
  accessLevel: dbUser.access_level,
  location: dbUser.location,
  specialization: dbUser.specialization,
  address: dbUser.address,
  tags: dbUser.user_tags?.map((ut: any) => ({
    id: ut.tags.id,
    name: ut.tags.name,
    color: ut.tags.color
  })) || [],
  authorizedRooms: dbUser.user_rooms?.map((ur: any) => ({
    id: ur.room_id,
    name: ur.rooms?.name || ''
  })) || []
});