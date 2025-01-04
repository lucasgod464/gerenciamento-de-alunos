export type AccessLevel = "Admin" | "Usuário Comum" | "Inativo";

export interface User {
  id: string;
  name: string;
  email: string;
  role: AccessLevel;
  company_id: string;
  created_at: string;
  last_access: string;
  status: "active" | "inactive";
  access_level: AccessLevel;
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
  password: string;
  role: AccessLevel;
  company_id: string;
  created_at: string;
  last_access: string;
  status: "active" | "inactive";
  access_level: AccessLevel;
  location?: string;
  specialization?: string;
  address?: string;
}

export const mapDatabaseUser = (user: DatabaseUser): User => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    company_id: user.company_id,
    created_at: user.created_at,
    last_access: user.last_access,
    status: user.status,
    access_level: user.access_level,
    location: user.location,
    specialization: user.specialization,
    address: user.address
  };
};