export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  responsibleCategory: string;
  location: string;
  specialization: string;
  status: "active" | "inactive";
  createdAt: string;
  lastAccess: string;
  companyId: string | null;
  authorizedRooms: string[];
}