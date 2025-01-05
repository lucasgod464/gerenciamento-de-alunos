export interface Company {
  id: string;
  name: string;
  document: string;
  usersLimit: number;
  currentUsers: number;
  roomsLimit: number;
  currentRooms: number;
  status: "Ativa" | "Inativa";
  createdAt: string;
  publicFolderPath: string;
  storageUsed: number;
  enrollmentFormUrl?: string;
}

export interface SupabaseCompany {
  id: string;
  name: string;
  document: string;
  users_limit: number;
  current_users: number;
  rooms_limit: number;
  current_rooms: number;
  status: string;
  created_at: string;
  public_folder_path: string;
  storage_used: number;
  enrollment_form_url?: string;
}

export const mapSupabaseCompanyToCompany = (company: SupabaseCompany): Company => ({
  id: company.id,
  name: company.name,
  document: company.document,
  usersLimit: company.users_limit,
  currentUsers: company.current_users,
  roomsLimit: company.rooms_limit,
  currentRooms: company.current_rooms,
  status: company.status as "Ativa" | "Inativa",
  createdAt: company.created_at,
  publicFolderPath: company.public_folder_path,
  storageUsed: company.storage_used,
  enrollmentFormUrl: company.enrollment_form_url,
});