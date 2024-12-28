export interface Room {
  id: string;
  name: string;
  schedule: string;
  location: string;
  category: string;
  status: boolean;
  companyId: string | null;
  studyRoom: string;
  authorizedUsers: string[];
  students: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
    companyId: string;
  }>;
}