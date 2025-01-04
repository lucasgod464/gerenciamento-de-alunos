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
  accessLevel?: "Admin" | "Usuário Comum";
  authorizedRooms?: string[];
  tags?: { id: string; name: string; color: string; }[];
}