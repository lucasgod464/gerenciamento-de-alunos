import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/utils/dateUtils";
import { AttendanceStudent } from "./types";

export const attendanceDataService = {
  async getAttendanceDays(companyId: string): Promise<Date[]> {
    const { data, error } = await supabase
      .from('daily_attendance')
      .select('date')
      .eq('company_id', companyId)
      .order('date', { ascending: true });

    if (error) throw error;

    const uniqueDates = [...new Set(data.map(d => d.date))];
    return uniqueDates.map(date => new Date(date));
  },

  async getDailyAttendance(date: string, companyId: string) {
    const { data: attendanceData, error } = await supabase
      .from('daily_attendance')
      .select(`
        student_id,
        status,
        students (
          id,
          name,
          room_students (
            room_id
          )
        )
      `)
      .eq('date', date)
      .eq('company_id', companyId);

    if (error) throw error;
    return attendanceData;
  },

  async getCompanyStudents(companyId: string): Promise<AttendanceStudent[]> {
    const { data: roomStudents, error } = await supabase
      .from('room_students')
      .select(`
        student_id,
        room_id,
        students (
          id,
          name,
          company_id
        )
      `)
      .eq('students.company_id', companyId);

    if (error) throw error;

    return roomStudents.map(rs => ({
      id: rs.students.id,
      name: rs.students.name,
      room: rs.room_id,
      status: "present",
      companyId: rs.students.company_id
    }));
  },

  async saveAttendance(attendance: {
    date: string;
    studentId: string;
    status: string;
    companyId: string;
  }) {
    const { error } = await supabase
      .from('daily_attendance')
      .upsert({
        date: attendance.date,
        student_id: attendance.studentId,
        status: attendance.status,
        company_id: attendance.companyId
      });

    if (error) throw error;
  },

  async cancelAttendance(date: string, companyId: string) {
    const { error } = await supabase
      .from('daily_attendance')
      .delete()
      .eq('date', date)
      .eq('company_id', companyId);

    if (error) throw error;
  }
};