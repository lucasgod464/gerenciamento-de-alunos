import { Student, mapSupabaseStudent } from "./student";
import { Json } from "@/integrations/supabase/types";

export interface Room {
  id: string;
  name: string;
  schedule: string;
  location: string;
  category: string;
  status: boolean;
  companyId: string;
  studyRoom: string;
  createdAt: string;
  students: Student[];
}

export interface SupabaseRoom {
  id: string;
  name: string;
  schedule: string;
  location: string;
  category: string;
  status: boolean;
  company_id: string;
  study_room: string;
  created_at: string;
  room_students?: {
    student_id: string;
    students: {
      id: string;
      name: string;
      birth_date: string;
      status: boolean;
      email: string;
      document: string;
      address: string;
      custom_fields: Json;
      company_id: string;
      created_at: string;
    };
  }[];
}

export const mapSupabaseRoom = (room: SupabaseRoom): Room => ({
  id: room.id,
  name: room.name,
  schedule: room.schedule,
  location: room.location,
  category: room.category,
  status: room.status,
  companyId: room.company_id,
  studyRoom: room.study_room,
  createdAt: room.created_at,
  students: room.room_students?.map(rs => mapSupabaseStudent(rs.students)) || []
});