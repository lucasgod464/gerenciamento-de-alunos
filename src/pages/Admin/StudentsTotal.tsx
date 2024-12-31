import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { Student } from "@/types/student";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { StudentColumns } from "@/components/admin/students/StudentColumns";

const AdminStudentsTotal = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const loadStudents = () => {
    if (!currentUser?.companyId) return;

    // Carregar todas as salas da empresa
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const companyRooms = allRooms.filter((room: any) => 
      room.companyId === currentUser.companyId
    );
    setRooms(companyRooms.map((room: any) => ({ id: room.id, name: room.name })));

    // Carregar alunos das salas
    let roomStudents: Student[] = [];
    companyRooms.forEach((room: any) => {
      if (room.students && Array.isArray(room.students)) {
        const students = room.students
          .filter((student: any) => student.companyId === currentUser.companyId)
          .map((student: Student) => ({
            ...student,
            room: room.id
          }));
        roomStudents = [...roomStudents, ...students];
      }
    });

    // Carregar alunos do formulário de inscrição (sem sala)
    const enrollments = JSON.parse(localStorage.getItem("enrollments") || "[]");
    const studentsWithoutRoom = enrollments
      .filter((student: Student) => !student.room)
      .map((student: Student) => ({
        ...student,
        companyId: currentUser.companyId
      }));

    // Combinar todos os alunos
    setStudents([...roomStudents, ...studentsWithoutRoom]);
  };

  useEffect(() => {
    loadStudents();
    
    const handleStorageChange = () => {
      loadStudents();
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

  const handleDeleteStudent = (id: string) => {
    try {
      // Remover aluno das salas
      const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
      const updatedRooms = allRooms.map((room: any) => {
        if (room.students) {
          room.students = room.students.filter((student: Student) => student.id !== id);
        }
        return room;
      });
      localStorage.setItem("rooms", JSON.stringify(updatedRooms));

      // Remover aluno da lista de inscrições
      const enrollments = JSON.parse(localStorage.getItem("enrollments") || "[]");
      const updatedEnrollments = enrollments.filter((student: Student) => student.id !== id);
      localStorage.setItem("enrollments", JSON.stringify(updatedEnrollments));

      loadStudents();

      toast({
        title: "Sucesso",
        description: "Aluno excluído com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir aluno",
        variant: "destructive",
      });
    }
  };

  const handleTransferStudent = (studentId: string, newRoomId: string) => {
    try {
      // Buscar o aluno na lista de inscrições
      const enrollments = JSON.parse(localStorage.getItem("enrollments") || "[]");
      const studentToTransfer = enrollments.find((s: Student) => s.id === studentId);
      
      if (studentToTransfer) {
        // Remover o aluno da lista de inscrições
        const updatedEnrollments = enrollments.filter((s: Student) => s.id !== studentId);
        localStorage.setItem("enrollments", JSON.stringify(updatedEnrollments));

        // Adicionar o aluno à sala selecionada
        const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
        const updatedRooms = allRooms.map((room: any) => {
          if (room.id === newRoomId) {
            if (!room.students) {
              room.students = [];
            }
            room.students.push({
              ...studentToTransfer,
              room: newRoomId,
              companyId: currentUser?.companyId,
              status: "active"
            });
          }
          return room;
        });

        localStorage.setItem("rooms", JSON.stringify(updatedRooms));
        loadStudents();

        toast({
          title: "Sucesso",
          description: "Aluno transferido com sucesso!",
        });
      }
    } catch (error) {
      console.error("Erro ao transferir aluno:", error);
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
