import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Student } from "@/types/student";
import { StudentTable } from "@/components/user/StudentTable";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const AdminStudentsTotal = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const loadStudents = () => {
    if (!currentUser?.companyId) return;

    // Carregar alunos das salas
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const companyRooms = allRooms.filter((room: any) => 
      room.companyId === currentUser.companyId
    );
    setRooms(companyRooms.map(room => ({ id: room.id, name: room.name })));

    // Coletar todos os alunos de todas as salas da empresa
    const roomStudents: Student[] = [];
    companyRooms.forEach((room: any) => {
      if (room.students && Array.isArray(room.students)) {
        const students = room.students.filter((student: any) => 
          typeof student === 'object' && student.companyId === currentUser.companyId
        ).map(student => ({
          ...student,
          room: room.id
        }));
        roomStudents.push(...students);
      }
    });

    // Carregar alunos do formulário público (sem sala)
    const formStudents = JSON.parse(localStorage.getItem("students") || "[]");
    const companyFormStudents = formStudents.filter((student: Student) => 
      !student.room && (!student.companyId || student.companyId === currentUser.companyId)
    );

    // Combinar todos os alunos
    setStudents([...roomStudents, ...companyFormStudents]);
  };

  useEffect(() => {
    loadStudents();
    
    // Adicionar listener para mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "students" || e.key === "rooms") {
        loadStudents();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentUser]);

  const handleDeleteStudent = (id: string) => {
    // Remover aluno do localStorage (tanto das salas quanto da lista de alunos sem sala)
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const formStudents = JSON.parse(localStorage.getItem("students") || "[]");
    
    // Atualizar salas
    const updatedRooms = allRooms.map((room: any) => {
      if (room.companyId === currentUser?.companyId && room.students) {
        room.students = room.students.filter((student: Student) => student.id !== id);
      }
      return room;
    });

    // Atualizar lista de alunos sem sala
    const updatedFormStudents = formStudents.filter((student: Student) => student.id !== id);

    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
    localStorage.setItem("students", JSON.stringify(updatedFormStudents));
    
    loadStudents();
    
    toast({
      title: "Sucesso",
      description: "Aluno excluído com sucesso!",
    });
  };

  const handleTransferStudent = (studentId: string, newRoomId: string) => {
    console.log("Iniciando transferência do aluno:", studentId, "para sala:", newRoomId);
    
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const formStudents = JSON.parse(localStorage.getItem("students") || "[]");
    
    // Encontrar o aluno (pode estar em uma sala ou na lista de alunos sem sala)
    let studentToTransfer: Student | null = null;
    let studentFound = false;
    
    // Procurar nas salas primeiro
    const updatedRooms = allRooms.map((room: any) => {
      if (room.students && !studentFound) {
        const student = room.students.find((s: Student) => s.id === studentId);
        if (student) {
          studentToTransfer = student;
          studentFound = true;
          // Remover o aluno da sala atual
          room.students = room.students.filter((s: Student) => s.id !== studentId);
        }
      }
      return room;
    });

    // Se não encontrou nas salas, procurar na lista de alunos sem sala
    if (!studentFound) {
      const formStudent = formStudents.find((s: Student) => s.id === studentId);
      if (formStudent) {
        studentToTransfer = formStudent;
        // Remover o aluno da lista de alunos sem sala
        const updatedFormStudents = formStudents.filter((s: Student) => s.id !== studentId);
        localStorage.setItem("students", JSON.stringify(updatedFormStudents));
      }
    }

    if (studentToTransfer) {
      console.log("Aluno encontrado para transferência:", studentToTransfer);
      
      // Adicionar o aluno à nova sala
      const targetRoomIndex = updatedRooms.findIndex((room: any) => room.id === newRoomId);
      if (targetRoomIndex !== -1) {
        if (!updatedRooms[targetRoomIndex].students) {
          updatedRooms[targetRoomIndex].students = [];
        }
        updatedRooms[targetRoomIndex].students.push({
          ...studentToTransfer,
          room: newRoomId
        });
      }

      // Atualizar o localStorage
      localStorage.setItem("rooms", JSON.stringify(updatedRooms));
      
      // Recarregar os dados
      loadStudents();

      console.log("Transferência concluída, atualizando estado...");
      
      toast({
        title: "Sucesso",
        description: "Aluno transferido com sucesso!",
      });
    } else {
      console.error("Aluno não encontrado para transferência");
      toast({
        title: "Erro",
        description: "Não foi possível encontrar o aluno para transferência",
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Alunos sem Sala</h2>
              <StudentTable 
                students={studentsWithoutRoom}
                rooms={rooms}
                onDeleteStudent={handleDeleteStudent}
                onTransferStudent={handleTransferStudent}
                showTransferOption={true}
              />
              {studentsWithoutRoom.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum aluno sem sala encontrado
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Alunos com Sala</h2>
              <StudentTable 
                students={studentsWithRoom}
                rooms={rooms}
                onDeleteStudent={handleDeleteStudent}
                onTransferStudent={handleTransferStudent}
                showTransferOption={true}
              />
              {studentsWithRoom.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum aluno com sala encontrado
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminStudentsTotal;