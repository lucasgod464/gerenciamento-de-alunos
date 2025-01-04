export interface Student {
  id: string;
  name: string;
  room: string;
  status: "present" | "absent" | "late" | "justified";
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