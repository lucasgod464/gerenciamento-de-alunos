export type CompanyStatus = 'Ativa' | 'Inativa' | 'Suspensa';

export interface Company {
  id: string;
  name: string;
  document: string;
  usersLimit: number;
  currentUsers: number;
  roomsLimit: number;
  currentRooms: number;
  status: CompanyStatus;
  createdAt: string;
  publicFolderPath: string;
  storageUsed: number;
  enrollmentFormUrl?: string;
}