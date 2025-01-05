import { supabase } from "@/integrations/supabase/client";
import { AttendanceStudent } from "./types";
import { formatDate } from "@/utils/dateUtils";

export const attendanceService = {
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

  async getDailyAttendance(date: Date, companyId: string) {
    const formattedDate = formatDate(date);
    console.log('Buscando presença para a data:', formattedDate);
    
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
      .eq('date', formattedDate)
      .eq('company_id', companyId);

    if (error) throw error;

    return attendanceData;
  },

  async saveAttendance(attendance: {
    date: Date;
    studentId: string;
    status: string;
    companyId: string;
  }) {
    const formattedDate = formatDate(attendance.date);
    console.log('Salvando presença para a data:', formattedDate);
    
    const { error } = await supabase
      .from('daily_attendance')
      .upsert({
        date: formattedDate,
        student_id: attendance.studentId,
        status: attendance.status,
        company_id: attendance.companyId
      });

    if (error) throw error;
  },

  async saveObservation(observation: {
    date: Date;
    text: string;
    companyId: string;
  }) {
    const formattedDate = formatDate(observation.date);
    
    const { error } = await supabase
      .from('daily_observations')
      .upsert({
        date: formattedDate,
        text: observation.text,
        company_id: observation.companyId
      });

    if (error) throw error;
  },

  async cancelAttendance(date: Date, companyId: string) {
    const formattedDate = formatDate(date);
    
    const { error: attendanceError } = await supabase
      .from('daily_attendance')
      .delete()
      .eq('date', formattedDate)
      .eq('company_id', companyId);

    if (attendanceError) throw attendanceError;

    const { error: observationError } = await supabase
      .from('daily_observations')
      .delete()
      .eq('date', formattedDate)
      .eq('company_id', companyId);

    if (observationError) throw observationError;
  }
};