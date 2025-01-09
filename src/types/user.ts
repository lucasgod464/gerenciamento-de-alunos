export type UserRole = "ADMIN" | "USER" | "SUPER_ADMIN";
export type UserStatus = "active" | "inactive";
export type UserAccessLevel = "Admin" | "Usuário Comum";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  lastAccess: string;
  status: UserStatus;
  accessLevel: UserAccessLevel;
  location?: string;
  specialization?: string;
  address?: string;
  tags?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  authorizedRooms?: Array<{
    id: string;
    name: string;
  }>;
  specializations?: Array<{
    id: string;
    name: string;
  }>;
}

export interface AuthUser extends User {
  accessToken?: string;
}