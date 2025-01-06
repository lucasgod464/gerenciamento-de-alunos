import { Student } from "./student";
import { mapSupabaseStudent } from "./student";

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
  room_students?: {
    student: {
      id: string;
      name: string;
      birth_date: string;
      status: boolean;
      email: string | null;
      document: string | null;
      address: string | null;
      custom_fields: any;
      company_id: string;
      created_at: string;
    };
  }[];
  company?: {
    name: string;
  };
}

export const mapSupabaseRoomToRoom = (room: SupabaseRoom): Room => ({
  id: room.id,
  name: room.name,
  schedule: room.schedule,
  location: room.location,
  category: room.category,
  status: room.status,
  companyId: room.company_id,
  studyRoom: room.study_room,
  createdAt: room.created_at,
  students: room.room_students?.map(rs => mapSupabaseStudent(rs.student)),
  companyName: room.company?.name,
});