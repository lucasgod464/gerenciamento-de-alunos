import { useEffect, useState } from "react";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AttendanceListProps {
  roomId: string;
  companyId: string;
  onAttendanceSaved: () => void;
}

export function AttendanceList({ roomId, companyId, onAttendanceSaved }: AttendanceListProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchStudents = async () => {
    try {
      if (!roomId || !user?.companyId) return;

      const { data: roomStudents, error: roomError } = await supabase
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

      if (roomError) throw roomError;

      const mappedStudents = roomStudents
        .map(rs => rs.student)
        .filter(student => student !== null) as Student[];

      console.log("Alunos encontrados:", mappedStudents);
      setStudents(mappedStudents);

    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      toast({
        title: "Erro ao carregar alunos",
        description: "Não foi possível carregar a lista de alunos.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (studentId: string, status: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Primeiro, verifica se já existe um registro para hoje
      const { data: existingRecord } = await supabase
        .from('daily_attendance')
        .select('*')
        .eq('student_id', studentId)
        .eq('date', today)
        .eq('room_id', roomId)
        .single();

      if (existingRecord) {
        // Atualiza o registro existente
        const { error: updateError } = await supabase
          .from('daily_attendance')
          .update({ status })
          .eq('id', existingRecord.id);

        if (updateError) throw updateError;
      } else {
        // Cria um novo registro
        const { error: insertError } = await supabase
          .from('daily_attendance')
          .insert({
            student_id: studentId,
            date: today,
            status,
            room_id: roomId,
            company_id: companyId
          });

        if (insertError) throw insertError;
      }

      setAttendanceStatus(prev => ({
        ...prev,
        [studentId]: status
      }));

      onAttendanceSaved();

      toast({
        title: "Presença registrada",
        description: "O status de presença foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar presença:", error);
      toast({
        title: "Erro ao registrar presença",
        description: "Não foi possível atualizar o status de presença.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchStudents();
    }
  }, [roomId]);

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>
                {attendanceStatus[student.id] ? (
                  <Badge variant={
                    attendanceStatus[student.id] === 'present' ? 'success' :
                    attendanceStatus[student.id] === 'absent' ? 'destructive' :
                    attendanceStatus[student.id] === 'late' ? 'warning' : 
                    'secondary'
                  }>
                    {attendanceStatus[student.id] === 'present' ? 'Presente' :
                     attendanceStatus[student.id] === 'absent' ? 'Ausente' :
                     attendanceStatus[student.id] === 'late' ? 'Atrasado' :
                     attendanceStatus[student.id] === 'justified' ? 'Justificado' : 
                     'Não registrado'}
                  </Badge>
                ) : (
                  <Badge variant="secondary">Não registrado</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(student.id, 'present')}
                    className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                  >
                    Presente
                  </button>
                  <button
                    onClick={() => handleStatusChange(student.id, 'absent')}
                    className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                  >
                    Ausente
                  </button>
                  <button
                    onClick={() => handleStatusChange(student.id, 'late')}
                    className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                  >
                    Atrasado
                  </button>
                  <button
                    onClick={() => handleStatusChange(student.id, 'justified')}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                  >
                    Justificado
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}