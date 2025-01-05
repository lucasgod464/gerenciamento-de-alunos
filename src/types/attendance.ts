export interface DateRange {
  from: Date;
  to: Date;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  studentId: string;
  roomId?: string;
  companyId?: string;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  justified: number;
  total: number;
}