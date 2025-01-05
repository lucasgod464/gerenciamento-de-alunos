export type CompanyStatus = "Ativa" | "Inativa";

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

export interface CompanyFormData {
  name: string;
  document: string;
  usersLimit: number;
  roomsLimit: number;
}

export const mapSupabaseCompany = (data: any): Company => ({
  id: data.id,
  name: data.name,
  document: data.document,
  usersLimit: data.users_limit,
  currentUsers: data.current_users,
  roomsLimit: data.rooms_limit,
  currentRooms: data.current_rooms,
  status: data.status as CompanyStatus,
  createdAt: data.created_at,
  publicFolderPath: data.public_folder_path,
  storageUsed: data.storage_used,
  enrollmentFormUrl: data.enrollment_form_url
});