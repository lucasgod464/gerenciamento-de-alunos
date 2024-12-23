export interface Room {
  id: string;
  name: string;
  schedule: string;
  location: string;
  category: string;
  capacity: number;
  resources: string;
  status: boolean;
  companyId: string | null;
  studyRoom: string;
  authorizedUsers: string[];
}