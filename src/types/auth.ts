export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  companyId: string;
  accessLevel: 'Admin' | 'Usuário Comum';
  createdAt: string;
  lastAccess: string;
}

export interface DatabaseUser {
  id: string;
  email: string;
  name: string;
  role: string;
  company_id: string;
  access_level: 'Admin' | 'Usuário Comum';
  created_at: string;
  last_access: string;
}

export const mapDatabaseUser = (user: DatabaseUser): AuthUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  companyId: user.company_id,
  accessLevel: user.access_level,
  createdAt: user.created_at,
  lastAccess: user.last_access
});