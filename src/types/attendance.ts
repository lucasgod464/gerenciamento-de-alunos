export interface DateRange {
  from: Date;
  to: Date;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  status: string;
  companyId: string;
  roomId: string;
  createdAt: string;
}

export interface SupabaseAttendanceRecord {
  id: string;
  date: string;
  student_id: string;
  status: string;
  company_id: string;
  room_id: string;
  created_at: string;
}

export const mapSupabaseAttendanceRecord = (record: SupabaseAttendanceRecord): AttendanceRecord => ({
  id: record.id,
  date: record.date,
  studentId: record.student_id,
  status: record.status,
  companyId: record.company_id,
  roomId: record.room_id,
  createdAt: record.created_at,
});