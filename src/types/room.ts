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
  createdAt: string;
  students?: Student[];
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
      email: string;
      document: string;
      address: string;
      custom_fields: any;
      company_id: string;
      created_at: string;
    };
  }[];
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
    createdAt: rs.student.created_at,
  })),
});