import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/utils/dateUtils";
import { AttendanceStudent } from "./types";

export const attendanceDataService = {
  async getAttendanceDays(companyId: string): Promise<Date[]> {
    const { data, error } = await supabase
      .from('daily_attendance')
      .select('date')
      .eq('company_id', companyId)
      .order('date');

    if (error) throw error;

    const uniqueDates = [...new Set(data.map(d => d.date))];
    return uniqueDates.map(date => new Date(date));
  },

  async getDailyAttendance(date: string, companyId: string): Promise<AttendanceStudent[]> {
    const { data: attendanceData, error } = await supabase
      .from('daily_attendance')
      .select(`
        student_id,
        status,
        students (
          id,
          name,
          room_students (
            room_id,
            rooms (
              name
            )
          )
        )
      `)
      .eq('date', date)
      .eq('company_id', companyId);

    if (error) throw error;

    return attendanceData.map(record => ({
      id: record.students.id,
      name: record.students.name,
      room: record.students.room_students?.[0]?.room_id || '',
      roomName: record.students.room_students?.[0]?.rooms?.name || '',
      status: record.status || "",
      companyId
    }));
  },

  async getDailyObservation(date: string, companyId: string) {
    const { data, error } = await supabase
      .from('daily_observations')
      .select('text')
      .eq('date', date)
      .eq('company_id', companyId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getCompanyStudents(companyId: string): Promise<AttendanceStudent[]> {
    const { data: roomStudents, error } = await supabase
      .from('room_students')
      .select(`
        student_id,
        room_id,
        rooms (
          name
        ),
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
      roomName: rs.rooms?.name || '',
      status: "",
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

  async saveObservation(observation: {
    date: string;
    text: string;
    companyId: string;
  }) {
    const { error } = await supabase
      .from('daily_observations')
      .upsert({
        date: observation.date,
        text: observation.text,
        company_id: observation.companyId
      });

    if (error) throw error;
  },

  async cancelAttendance(date: string, companyId: string) {
    const { error: observationError } = await supabase
      .from('daily_observations')
      .delete()
      .eq('date', date)
      .eq('company_id', companyId);

    if (observationError) throw observationError;

    const { error: attendanceError } = await supabase
      .from('daily_attendance')
      .delete()
      .eq('date', date)
      .eq('company_id', companyId);

    if (attendanceError) throw attendanceError;
  }
};