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
  status: "Ativa" | "Inativa";
  created_at: string;
  public_folder_path: string;
  storage_used: number;
  enrollment_form_url?: string;
}

export const mapSupabaseCompany = (company: SupabaseCompany): Company => ({
  id: company.id,
  name: company.name,
  document: company.document,
  usersLimit: company.users_limit,
  currentUsers: company.current_users,
  roomsLimit: company.rooms_limit,
  currentRooms: company.current_rooms,
  status: company.status,
  createdAt: company.created_at,
  publicFolderPath: company.public_folder_path,
  storageUsed: company.storage_used,
  enrollmentFormUrl: company.enrollment_form_url,
});

export const mapCompanyToSupabase = (company: Company): Omit<SupabaseCompany, 'id' | 'created_at'> => ({
  name: company.name,
  document: company.document,
  users_limit: company.usersLimit,
  current_users: company.currentUsers,
  rooms_limit: company.roomsLimit,
  current_rooms: company.currentRooms,
  status: company.status,
  public_folder_path: company.publicFolderPath,
  storage_used: company.storageUsed,
  enrollment_form_url: company.enrollmentFormUrl,
});