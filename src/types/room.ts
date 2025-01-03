import { Student } from "./student";

export interface Room {
  id: string;
  name: string;
  schedule: string;
  location: string;
  category: string;
  status: boolean;
  companyId: string;
  studyRoom: string;
  authorizedUsers: any[];
  students: Student[];
  createdAt: string;
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
    student: Student;
  }[];
}

export function mapSupabaseRoomToRoom(room: SupabaseRoom): Room {
  return {
    id: room.id,
    name: room.name,
    schedule: room.schedule,
    location: room.location,
    category: room.category,
    status: room.status,
    companyId: room.company_id,
    studyRoom: room.study_room,
    authorizedUsers: [],
    students: room.room_students?.map(rs => rs.student) || [],
    createdAt: room.created_at,
  };
}