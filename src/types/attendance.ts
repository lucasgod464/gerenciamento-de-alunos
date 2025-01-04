export type AttendanceStatus = "present" | "absent" | "late" | "justified" | "";

export interface Student {
  id: string;
  name: string;
  room: string;
  roomName?: string;
  status: AttendanceStatus;
  companyId: string | null;
}

export interface DailyAttendance {
  date: string;
  students: Student[];
}

export interface DailyObservation {
  date: string;
  text: string;
}