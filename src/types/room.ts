import { Student } from "./student";

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
  room_students?: RoomStudent[];
}

export const mapSupabaseRoom = (room: SupabaseRoom): Room => ({
  id: room.id,
  name: room.name,
  schedule: room.schedule,
  location: room.location,
  category: room.category,
  status: room.status,
  company_id: room.company_id,
  study_room: room.study_room,
  created_at: room.created_at,
  room_students: room.room_students
});

// Mantendo a compatibilidade com o código existente
export const mapSupabaseRoomToRoom = mapSupabaseRoom;