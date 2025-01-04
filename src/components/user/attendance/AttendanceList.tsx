import { useEffect, useState } from "react";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { AttendanceRow } from "./AttendanceRow";
import { useToast } from "@/hooks/use-toast";

interface AttendanceListProps {
  students: Student[];
  date: string;
  roomId: string;
}

export const AttendanceList = ({ students, date, roomId }: AttendanceListProps) => {
  const [attendanceData, setAttendanceData] = useState<Record<string, any>>({});
  const { toast } = useToast();

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const { data: attendance } = await supabase
          .from('daily_attendance')
          .select('*')
          .eq('date', date)
          .eq('room_id', roomId);

        if (attendance) {
          const attendanceMap = attendance.reduce((acc: Record<string, any>, curr) => {
            if (curr && curr.student_id) {
              acc[curr.student_id] = curr;
            }
            return acc;
          }, {});
          setAttendanceData(attendanceMap);
        }
      } catch (error) {
        console.error('Erro ao carregar presença:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados de presença",
          variant: "destructive",
        });
      }
    };

    if (date && roomId) {
      loadAttendance();
    }
  }, [date, roomId]);

  return (
    <div className="space-y-4">
      {students.map((student) => {
        const attendance = attendanceData[student.id] || {};
        return (
          <AttendanceRow
            key={student.id}
            student={student}
            date={date}
            roomId={roomId}
            initialStatus={attendance?.status || 'absent'}
            studentId={attendance?.student_id}
          />
        );
      })}
    </div>
  );
};