export type UserRole = 'ADMIN' | 'USER' | 'SUPER_ADMIN';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  accessLevel: "Admin" | "Usuário Comum";
  companyId: string;
  location?: string | null;
  specialization?: string | null;
  createdAt: string;
  updatedAt: string;
  status: UserStatus;
  authorizedRooms?: string[];
  tags?: { id: string; name: string; color: string; }[];
  company?: {
    id: string;
    name: string;
    status: string;
  };
}