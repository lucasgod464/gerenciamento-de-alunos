import { Student } from "./student";
import { Json } from "@/integrations/supabase/types";

export interface Room {
  id: string;
  name: string;
  schedule: string;
  location: string;
  category: string;
  status: boolean;
  company_id: string;
  study_room: string;
  created_at: string;
  room_students?: RoomStudent[];
  students?: Student[];
}

export interface RoomStudent {
  student: Student;
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
    student: {
      id: string;
      name: string;
      birth_date: string;
      status: boolean;
      email: string | null;
      document: string | null;
      address: string | null;
      custom_fields: Record<string, any>;
      company_id: string;
      created_at: string;
    };
  }[];
}

export const mapSupabaseRoomToRoom = (room: SupabaseRoom): Room => {
  const students = room.room_students?.map(rs => ({
    ...rs.student,
    custom_fields: typeof rs.student.custom_fields === 'string' 
      ? JSON.parse(rs.student.custom_fields)
      : rs.student.custom_fields
  })) || [];
  
  return {
    id: room.id,
    name: room.name,
    schedule: room.schedule,
    location: room.location,
    category: room.category,
    status: room.status,
    company_id: room.company_id,
    study_room: room.study_room,
    created_at: room.created_at,
    room_students: room.room_students,
    students
  };
};