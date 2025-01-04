export type AttendanceStatus = "present" | "absent" | "late" | "justified" | "";

export interface AttendanceStudent {
  id: string;
  name: string;
  room: string;
  roomName?: string;
  status: AttendanceStatus;
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