import { Json } from "@/integrations/supabase/types";

export interface AttendanceStudent {
  id: string;
  name: string;
  room: string;
  status: "present" | "absent" | "late" | "justified";
  companyId: string;
}

export interface DailyAttendance {
  date: string;
  students: AttendanceStudent[];
}

export interface DailyObservation {
  date: string;
  text: string;
}