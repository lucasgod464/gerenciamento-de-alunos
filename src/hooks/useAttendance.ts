import { useState, useEffect } from "react";
import { Student, DailyAttendance, DailyObservation } from "@/types/attendance";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export function useAttendance(selectedDate: Date | undefined) {
  const [dailyAttendances, setDailyAttendances] = useState<DailyAttendance[]>([]);
  const [observation, setObservation] = useState("");
  const [observations, setObservations] = useState<DailyObservation[]>([]);
  const [attendanceDays, setAttendanceDays] = useState<Date[]>([]);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const getCompanyStudents = async () => {
    if (!currentUser?.companyId) return [];
    
    try {
      const { data: roomStudents, error } = await supabase
        .from('room_students')
        .select(`
          student:students (
            id,
            name,
            room:room_id
          )
        `)
        .eq('students.company_id', currentUser.companyId);

      if (error) throw error;

      return roomStudents.map(rs => ({
        ...rs.student,
        status: "present" as const
      }));
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  };

  const fetchAttendanceDays = async () => {
    if (!currentUser?.companyId) return;

    try {
      const { data, error } = await supabase
        .from('daily_attendance')
        .select('date')
        .eq('company_id', currentUser.companyId)
        .distinct();

      if (error) throw error;

      const days = data.map(d => new Date(d.date));
      setAttendanceDays(days);
    } catch (error) {
      console.error('Error fetching attendance days:', error);
    }
  };

  const fetchDailyAttendance = async () => {
    if (!selectedDate || !currentUser?.companyId) return;

    const dateStr = selectedDate.toISOString().split('T')[0];
    
    try {
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
        .eq('date', dateStr)
        .eq('company_id', currentUser.companyId);

      if (error) throw error;

      if (attendanceData.length === 0) {
        const students = await getCompanyStudents();
        setDailyAttendances([{ date: dateStr, students }]);
      } else {
        const students = attendanceData.map(record => ({
          id: record.students.id,
          name: record.students.name,
          room: record.students.room_students?.[0]?.room_id || '',
          status: record.status as "present" | "absent" | "late" | "justified"
        }));

        setDailyAttendances([{ date: dateStr, students }]);
      }

      // Fetch observation for the day
      const { data: obsData, error: obsError } = await supabase
        .from('daily_observations')
        .select('text')
        .eq('date', dateStr)
        .eq('company_id', currentUser.companyId)
        .maybeSingle();

      if (obsError) throw obsError;

      setObservation(obsData?.text || '');
    } catch (error) {
      console.error('Error fetching daily attendance:', error);
    }
  };

  useEffect(() => {
    fetchAttendanceDays();
  }, [currentUser]);

  useEffect(() => {
    if (selectedDate) {
      fetchDailyAttendance();
    }
  }, [selectedDate, currentUser]);

  const handleStatusChange = async (studentId: string, status: Student["status"]) => {
    if (!selectedDate || !currentUser?.companyId) return;
    
    const dateStr = selectedDate.toISOString().split('T')[0];

    try {
      const { error } = await supabase
        .from('daily_attendance')
        .upsert({
          date: dateStr,
          student_id: studentId,
          status,
          company_id: currentUser.companyId
        });

      if (error) throw error;

      await fetchDailyAttendance();

      toast({
        title: "Status atualizado",
        description: "O status de presença foi atualizado com sucesso."
      });
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao atualizar o status de presença.",
        variant: "destructive"
      });
    }
  };

  const handleObservationChange = async (text: string) => {
    if (!selectedDate || !currentUser?.companyId) return;
    
    const dateStr = selectedDate.toISOString().split('T')[0];

    try {
      const { error } = await supabase
        .from('daily_observations')
        .upsert({
          date: dateStr,
          text,
          company_id: currentUser.companyId
        });

      if (error) throw error;

      setObservation(text);
    } catch (error) {
      console.error('Error updating observation:', error);
      toast({
        title: "Erro ao salvar observação",
        description: "Ocorreu um erro ao salvar a observação.",
        variant: "destructive"
      });
    }
  };

  const startAttendance = async () => {
    if (!selectedDate || !currentUser?.companyId) return;

    try {
      const students = await getCompanyStudents();
      const dateStr = selectedDate.toISOString().split('T')[0];

      const attendanceRecords = students.map(student => ({
        date: dateStr,
        student_id: student.id,
        status: 'present',
        company_id: currentUser.companyId
      }));

      const { error } = await supabase
        .from('daily_attendance')
        .upsert(attendanceRecords);

      if (error) throw error;

      await fetchAttendanceDays();
      await fetchDailyAttendance();

      toast({
        title: "Chamada iniciada",
        description: "A chamada foi iniciada para o dia selecionado.",
      });
    } catch (error) {
      console.error('Error starting attendance:', error);
      toast({
        title: "Erro ao iniciar chamada",
        description: "Ocorreu um erro ao iniciar a chamada.",
        variant: "destructive"
      });
    }
  };

  const cancelAttendance = async () => {
    if (!selectedDate || !currentUser?.companyId) return;

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];

      const { error: attendanceError } = await supabase
        .from('daily_attendance')
        .delete()
        .eq('date', dateStr)
        .eq('company_id', currentUser.companyId);

      if (attendanceError) throw attendanceError;

      const { error: observationError } = await supabase
        .from('daily_observations')
        .delete()
        .eq('date', dateStr)
        .eq('company_id', currentUser.companyId);

      if (observationError) throw observationError;

      await fetchAttendanceDays();
      setDailyAttendances([]);
      setObservation('');

      toast({
        title: "Chamada cancelada",
        description: "A chamada foi cancelada para o dia selecionado.",
      });
    } catch (error) {
      console.error('Error canceling attendance:', error);
      toast({
        title: "Erro ao cancelar chamada",
        description: "Ocorreu um erro ao cancelar a chamada.",
        variant: "destructive"
      });
    }
  };

  const isAttendanceDay = (date: Date) => {
    return attendanceDays.some(attendanceDate => 
      attendanceDate.toISOString().split('T')[0] === date.toISOString().split('T')[0]
    );
  };

  return {
    dailyAttendances,
    observation,
    observations,
    attendanceDays,
    handleStatusChange,
    handleObservationChange,
    startAttendance,
    cancelAttendance,
    isAttendanceDay,
    getCurrentDayStudents: () => {
      if (!selectedDate) return [];
      const dateStr = selectedDate.toISOString().split('T')[0];
      const attendance = dailyAttendances.find(da => da.date === dateStr);
      return attendance?.students || [];
    }
  };
}