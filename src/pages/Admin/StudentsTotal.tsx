import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { StudentColumns } from "@/components/admin/students/StudentColumns";

export function StudentsTotal() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const { data: studentsData, error } = await supabase
        .from('students')
        .select(`
          *,
          room_students(room_id)
        `)
        .eq('company_id', currentUser?.companyId);

      if (error) throw error;

      const mappedStudents = studentsData.map(student => ({
        id: student.id,
        name: student.name,
        birthDate: student.birth_date,
        status: student.status,
        email: student.email,
        document: student.document,
        address: student.address,
        customFields: student.custom_fields as Record<string, string> | null,
        companyId: student.company_id,
        createdAt: student.created_at,
        room: student.room_students?.[0]?.room_id
      }));
      
      setStudents(mappedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Erro ao carregar alunos",
        description: "Ocorreu um erro ao carregar a lista de alunos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const { data: roomsData, error } = await supabase
        .from('rooms')
        .select('id, name')
        .eq('company_id', currentUser?.companyId);

      if (error) throw error;
      setRooms(roomsData);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (error) throw error;

      toast({
        title: "Aluno excluído",
        description: "O aluno foi excluído com sucesso.",
      });

      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Erro ao excluir aluno",
        description: "Ocorreu um erro ao excluir o aluno.",
        variant: "destructive",
      });
    }
  };

  const handleTransferStudent = async (studentId: string, newRoomId: string | null) => {
    try {
      // First, delete any existing room assignments
      await supabase
        .from('room_students')
        .delete()
        .eq('student_id', studentId);

      // If a new room is selected, create the assignment
      if (newRoomId) {
        const { error } = await supabase
          .from('room_students')
          .insert({
            student_id: studentId,
            room_id: newRoomId
          });

        if (error) throw error;
      }

      toast({
        title: "Aluno transferido",
        description: "O aluno foi transferido com sucesso.",
      });

      fetchStudents();
    } catch (error) {
      console.error('Error transferring student:', error);
      toast({
        title: "Erro ao transferir aluno",
        description: "Ocorreu um erro ao transferir o aluno.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (currentUser?.companyId) {
      fetchStudents();
      fetchRooms();
    }
  }, [currentUser]);

  const studentsWithRoom = students.filter(student => student.room);
  const studentsWithoutRoom = students.filter(student => !student.room);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Total de Alunos</h1>
            <p className="text-muted-foreground">
              Gerencie os alunos do sistema
            </p>
          </div>
        </div>

        <StudentColumns
          studentsWithoutRoom={studentsWithoutRoom}
          studentsWithRoom={studentsWithRoom}
          rooms={rooms}
          onDeleteStudent={handleDeleteStudent}
          onTransferStudent={handleTransferStudent}
        />
      </div>
    </DashboardLayout>
  );
}

export default StudentsTotal;