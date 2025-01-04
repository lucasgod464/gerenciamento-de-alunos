import { supabase } from "@/integrations/supabase/client";
import { DailyAttendance, DailyObservation, AttendanceStatus } from "@/types/attendance";

export const fetchDailyAttendance = async (dateStr: string, companyId: string) => {
  const { data: attendanceData, error: attendanceError } = await supabase
    .from('daily_attendance')
    .select(`
      *,
      students (
        id,
        name,
        birth_date,
        status,
        email,
        document,
        address,
        custom_fields,
        company_id,
        created_at
      )
    `)
    .eq('date', dateStr)
    .eq('company_id', companyId);

  if (attendanceError) throw attendanceError;
  return attendanceData;
};

export const fetchDailyObservation = async (dateStr: string, companyId: string) => {
  const { data: observationData, error: observationError } = await supabase
    .from('daily_observations')
    .select('*')
    .eq('date', dateStr)
    .eq('company_id', companyId)
    .maybeSingle();

  if (observationError && observationError.code !== 'PGRST116') {
    throw observationError;
  }
  return observationData;
};

export const fetchAttendanceDays = async (companyId: string) => {
  const { data: daysData, error: daysError } = await supabase
    .from('daily_attendance')
    .select('date')
    .eq('company_id', companyId);

  if (daysError) throw daysError;
  return [...new Set(daysData.map(day => day.date))];
};

export const updateAttendanceStatus = async (
  studentId: string,
  dateStr: string,
  status: AttendanceStatus,
  companyId: string
) => {
  const { error } = await supabase
    .from('daily_attendance')
    .upsert({
      student_id: studentId,
      date: dateStr,
      status,
      company_id: companyId
    });

  if (error) throw error;
};

export const updateDailyObservation = async (
  dateStr: string,
  text: string,
  companyId: string
) => {
  const { error } = await supabase
    .from('daily_observations')
    .upsert({
      date: dateStr,
      text,
      company_id: companyId
    });

  if (error) throw error;
};

export const startNewAttendance = async (
  students: any[],
  dateStr: string,
  companyId: string
) => {
  const attendanceRecords = students.map(student => ({
    student_id: student.id,
    date: dateStr,
    status: 'present' as AttendanceStatus,
    company_id: companyId
  }));

  const { error } = await supabase
    .from('daily_attendance')
    .upsert(attendanceRecords);

  if (error) throw error;
};

export const cancelDailyAttendance = async (dateStr: string, companyId: string) => {
  const { error: attendanceError } = await supabase
    .from('daily_attendance')
    .delete()
    .eq('date', dateStr)
    .eq('company_id', companyId);

  if (attendanceError) throw attendanceError;

  const { error: observationError } = await supabase
    .from('daily_observations')
    .delete()
    .eq('date', dateStr)
    .eq('company_id', companyId);

  if (observationError) throw observationError;
};