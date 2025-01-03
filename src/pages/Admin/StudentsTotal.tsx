import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { Student } from "@/types/student";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { StudentColumns } from "@/components/admin/students/StudentColumns";
import { supabase } from "@/integrations/supabase/client";

const AdminStudentsTotal = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const fetchStudents = async () => {
    if (!currentUser?.companyId) return;

    try {
      // Buscar alunos
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select(`
          *,
          rooms (
            id,
            name
          )
        `)
        .eq('company_id', currentUser.companyId);

      if (studentsError) throw studentsError;

      // Buscar salas
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('id, name')
        .eq('company_id', currentUser.companyId);

      if (roomsError) throw roomsError;

      setRooms(roomsData || []);
      setStudents(studentsData || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar alunos",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStudents();
    
    const handleStorageChange = () => {
      fetchStudents();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("studentAdded", handleStorageChange);
    window.addEventListener("enrollmentAdded", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("studentAdded", handleStorageChange);
      window.removeEventListener("enrollmentAdded", handleStorageChange);
    };
  }, [currentUser]);

  const handleDeleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchStudents();
      toast({
        title: "Sucesso",
        description: "Aluno excluído com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir aluno",
        variant: "destructive",
      });
    }
  };

  const handleTransferStudent = async (studentId: string, newRoomId: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({ room_id: newRoomId })
        .eq('id', studentId);

      if (error) throw error;

      fetchStudents();
      toast({
        title: "Sucesso",
        description: "Aluno transferido com sucesso!",
      });
    } catch (error) {
      console.error('Error transferring student:', error);
      toast({
        title: "Erro",
        description: "Erro ao transferir aluno",
        variant: "destructive",
      });
    }
  };

  const filteredStudents = students.filter((student) => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const studentsWithoutRoom = filteredStudents.filter(student => !student.room);
  const studentsWithRoom = filteredStudents.filter(student => student.room);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Alunos Total</h1>
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar alunos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <StudentColumns
          studentsWithoutRoom={students.filter(student => !student.room)}
          studentsWithRoom={students.filter(student => student.room)}
          rooms={rooms}
          onDeleteStudent={handleDeleteStudent}
          onTransferStudent={handleTransferStudent}
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminStudentsTotal;
