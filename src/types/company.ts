export interface Company {
  id: string;
  name: string;
  document: string;
  users_limit: number;
  current_users: number;
  rooms_limit: number;
  current_rooms: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}