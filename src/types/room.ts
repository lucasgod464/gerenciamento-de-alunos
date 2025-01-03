import { Student } from "./student";

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
  students: Student[];
  created_at?: string;
}

export interface SupabaseRoom {
  id: string;
  name: string;
  schedule: string;
  location: string;
  category: string;
  status: boolean;
  company_id: string | null;
  study_room: string;
  created_at: string;
  room_authorized_users?: { user_id: string }[];
  room_students?: { student_id: string }[];
}

export function mapSupabaseRoomToRoom(supabaseRoom: SupabaseRoom): Room {
  return {
    id: supabaseRoom.id,
    name: supabaseRoom.name,
    schedule: supabaseRoom.schedule,
    location: supabaseRoom.location,
    category: supabaseRoom.category,
    status: supabaseRoom.status,
    companyId: supabaseRoom.company_id,
    studyRoom: supabaseRoom.study_room || '',
    authorizedUsers: supabaseRoom.room_authorized_users?.map(auth => auth.user_id) || [],
    students: supabaseRoom.room_students?.map(student => ({
      id: student.student_id,
      name: '',
      birthDate: null,
      status: true,
      email: null,
      document: null,
      address: null,
      customFields: null,
      companyId: supabaseRoom.company_id,
      createdAt: supabaseRoom.created_at,
      room: supabaseRoom.id
    })) || [],
    created_at: supabaseRoom.created_at
  };
}