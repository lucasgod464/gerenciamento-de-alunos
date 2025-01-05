import { Student, SupabaseStudent, mapSupabaseStudent } from "./student";

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
    student: SupabaseStudent;
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