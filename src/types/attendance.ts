import { Json } from "@/integrations/supabase/types";

export type AttendanceStatus = "present" | "absent" | "late" | "justified";

export interface Student {
  id: string;
  name: string;
  room?: string;
  status?: AttendanceStatus;
  birth_date?: string;
  email?: string | null;
  document?: string | null;
  address?: string | null;
  custom_fields?: Json;
  company_id?: string;
  created_at?: string;
}

export interface DailyAttendance {
  id: string;
  date: string;
  student_id: string;
  status: AttendanceStatus;
  company_id: string | null;
  created_at: string;
  room_id: string | null;
  students: Student;
}

export interface DailyObservation {
  id: string;
  date: string;
  text: string;
  company_id: string | null;
  created_at: string;
}