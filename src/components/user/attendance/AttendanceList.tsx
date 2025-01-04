import { useEffect, useState } from "react";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AttendanceListProps {
  roomId: string;
  companyId: string;
  onAttendanceSaved: () => void;
}

export function AttendanceList({ roomId, companyId, onAttendanceSaved }: AttendanceListProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
  }, [roomId]);

  const fetchStudents = async () => {
    try {
      console.log('Buscando alunos para a sala:', roomId);
      
      const { data: roomStudents, error: roomStudentsError } = await supabase
        .from('room_students')
        .select(`
          student:students (
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
        .eq('room_id', roomId);

      if (roomStudentsError) {
        throw roomStudentsError;
      }

      console.log('Alunos encontrados:', roomStudents);

      const students = roomStudents
        .map(rs => rs.student)
        .filter(student => student !== null);

      setStudents(students);

    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      toast({
        title: "Erro ao carregar alunos",
        description: "Não foi possível carregar a lista de alunos.",
        variant: "destructive",
      });
    }
  };

  const handleAttendanceChange = (studentId: string, status: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const getButtonVariant = (studentId: string, status: string) => {
    return attendance[studentId] === status ? "success" : "secondary";
  };

  const saveAttendance = async () => {
    try {
      const date = new Date().toISOString().split('T')[0];
      const attendanceRecords = Object.entries(attendance).map(([studentId, status]) => ({
        date,
        student_id: studentId,
        status,
        company_id: companyId,
        room_id: roomId
      }));

      const { error } = await supabase
        .from('daily_attendance')
        .insert(attendanceRecords);

      if (error) throw error;

      toast({
        title: "Presença registrada",
        description: "A presença foi registrada com sucesso.",
      });

      onAttendanceSaved();
    } catch (error) {
      console.error('Erro ao salvar presença:', error);
      toast({
        title: "Erro ao registrar presença",
        description: "Ocorreu um erro ao tentar registrar a presença.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {students.map((student) => (
        <div key={student.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <span className="font-medium">{student.name}</span>
          <div className="flex gap-2">
            <Button
              variant={getButtonVariant(student.id, "present")}
              onClick={() => handleAttendanceChange(student.id, "present")}
            >
              Presente
            </Button>
            <Button
              variant={getButtonVariant(student.id, "absent")}
              onClick={() => handleAttendanceChange(student.id, "absent")}
            >
              Ausente
            </Button>
            <Button
              variant={getButtonVariant(student.id, "late")}
              onClick={() => handleAttendanceChange(student.id, "late")}
            >
              Atrasado
            </Button>
            <Button
              variant={getButtonVariant(student.id, "justified")}
              onClick={() => handleAttendanceChange(student.id, "justified")}
            >
              Justificado
            </Button>
          </div>
        </div>
      ))}
      {students.length > 0 && (
        <Button onClick={saveAttendance} className="w-full">
          Salvar Presença
        </Button>
      )}
      {students.length === 0 && (
        <p className="text-center text-muted-foreground py-4">
          Nenhum aluno encontrado nesta sala
        </p>
      )}
    </div>
  );
}