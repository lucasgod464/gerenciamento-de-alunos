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
  createdAt: string;
  authorizedUsers?: string[];
  students?: Student[];
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
  room_students?: {
    student: {
      id: string;
      name: string;
      birth_date: string;
      status: boolean;
      email: string | null;
      document: string | null;
      address: string | null;
      custom_fields: Record<string, any> | null;
      company_id: string | null;
      created_at: string;
    };
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
    createdAt: room.created_at,
    students: room.room_students?.map(rs => ({
      id: rs.student.id,
      name: rs.student.name,
      birthDate: rs.student.birth_date,
      status: rs.student.status,
      email: rs.student.email,
      document: rs.student.document,
      address: rs.student.address,
      customFields: rs.student.custom_fields,
      companyId: rs.student.company_id,
      createdAt: rs.student.created_at
    }))
  };
}