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

    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const companyRooms = allRooms.filter((room: any) => 
      room.companyId === currentUser.companyId
    );
    setRooms(companyRooms.map(room => ({ id: room.id, name: room.name })));

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

    const formStudents = JSON.parse(localStorage.getItem("students") || "[]");
    const companyFormStudents = formStudents.filter((student: Student) => 
      !student.room && (!student.companyId || student.companyId === currentUser.companyId)
    );

    setStudents([...roomStudents, ...companyFormStudents]);
  };

  useEffect(() => {
    loadStudents();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "students" || e.key === "rooms") {
        loadStudents();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentUser]);

  const handleDeleteStudent = (id: string) => {
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const formStudents = JSON.parse(localStorage.getItem("students") || "[]");
    
    const updatedRooms = allRooms.map((room: any) => {
      if (room.companyId === currentUser?.companyId && room.students) {
        room.students = room.students.filter((student: Student) => student.id !== id);
      }
      return room;
    });

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
    
    let studentToTransfer: Student | null = null;
    let studentFound = false;
    
    // Procurar nas salas primeiro
    const updatedRooms = allRooms.map((room: any) => {
      if (room.students && !studentFound) {
        const student = room.students.find((s: Student) => s.id === studentId);
        if (student) {
          studentToTransfer = { ...student };
          studentFound = true;
          room.students = room.students.filter((s: Student) => s.id !== studentId);
        }
      }
      return room;
    });

    // Se não encontrou nas salas, procurar na lista de alunos sem sala
    if (!studentFound) {
      const formStudent = formStudents.find((s: Student) => s.id === studentId);
      if (formStudent) {
        studentToTransfer = { ...formStudent };
        const updatedFormStudents = formStudents.filter((s: Student) => s.id !== studentId);
        localStorage.setItem("students", JSON.stringify(updatedFormStudents));
      }
    }

    if (studentToTransfer) {
      const targetRoomIndex = updatedRooms.findIndex((room: any) => room.id === newRoomId);
      if (targetRoomIndex !== -1) {
        if (!updatedRooms[targetRoomIndex].students) {
          updatedRooms[targetRoomIndex].students = [];
        }
        updatedRooms[targetRoomIndex].students.push({
          ...studentToTransfer,
          room: newRoomId
        });

        localStorage.setItem("rooms", JSON.stringify(updatedRooms));
        loadStudents(); // Recarrega os dados imediatamente após a transferência

        toast({
          title: "Sucesso",
          description: "Aluno transferido com sucesso!",
        });
      }
    } else {
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
};

export default AdminStudentsTotal;