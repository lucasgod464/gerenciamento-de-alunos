export interface User {
  id: string;
  name: string;
  email: string;
  responsibleRoom: string;
  location: string;
  specialization: string;
  status: "active" | "inactive";
  createdAt: string;
  lastAccess: string;
}