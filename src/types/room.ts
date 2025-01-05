import { Json } from "@/integrations/supabase/types";
import { Student, mapSupabaseStudent } from "./student";

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
  students?: Student[];
  companyName?: string;
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
  companies?: {
    name: string;
  };
  room_students?: {
    student: {
      id: string;
      name: string;
      birth_date: string;
      status: boolean;
      email?: string;
      document?: string;
      address?: string;
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
  companyName: room.companies?.name,
  students: room.room_students?.map(rs => mapSupabaseStudent(rs.student)) || [],
});

export const mapRoomToSupabase = (room: Room): Omit<SupabaseRoom, 'id' | 'created_at' | 'room_students'> => ({
  name: room.name,
  schedule: room.schedule,
  location: room.location,
  category: room.category,
  status: room.status,
  company_id: room.companyId,
  study_room: room.studyRoom,
});