export type UserStatus = 'active' | 'inactive';
export type AccessLevel = 'Admin' | 'Usuário Comum';

export interface User {
  id: string;
  name: string;
  email: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  lastAccess: string;
  accessLevel: AccessLevel;
  location?: string;
  specialization?: string;
  status: UserStatus;
  address?: string;
  role: string;
  tags?: { id: string; name: string; color: string; }[];
  authorizedRooms?: { id: string; name: string; }[];
}

export interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  password: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  last_access: string;
  access_level: AccessLevel;
  location?: string;
  specialization?: string;
  status: string;
  address?: string;
  role: string;
}

export const mapDatabaseUser = (user: DatabaseUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  companyId: user.company_id,
  createdAt: user.created_at,
  updatedAt: user.updated_at,
  lastAccess: user.last_access,
  accessLevel: user.access_level,
  location: user.location,
  specialization: user.specialization,
  status: user.status as UserStatus,
  address: user.address,
  role: user.role
});

export const mapUserToDatabase = (user: User): Omit<DatabaseUser, 'id' | 'created_at'> => ({
  name: user.name,
  email: user.email,
  password: '', // This should be handled separately
  company_id: user.companyId,
  updated_at: user.updatedAt,
  last_access: user.lastAccess,
  access_level: user.accessLevel,
  location: user.location,
  specialization: user.specialization,
  status: user.status,
  address: user.address,
  role: user.role
});