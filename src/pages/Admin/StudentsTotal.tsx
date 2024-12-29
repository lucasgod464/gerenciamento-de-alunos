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

    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const companyRooms = allRooms.filter((room: any) => 
      room.companyId === currentUser.companyId
    );

    // Coletar todos os alunos de todas as salas da empresa
    const allStudents: Student[] = [];
    companyRooms.forEach((room: any) => {
      if (room.students && Array.isArray(room.students)) {
        const roomStudents = room.students.filter((student: any) => 
          typeof student === 'object' && student.companyId === currentUser.companyId
        ).map(student => ({
          ...student,
          room: room.id // Garantir que cada aluno tenha a referência da sala
        }));
        allStudents.push(...roomStudents);
      }
    });

    setStudents(allStudents);
    setRooms(companyRooms.map(room => ({ id: room.id, name: room.name })));
  };

  useEffect(() => {
    loadStudents();
  }, [currentUser]);

  const handleDeleteStudent = (id: string) => {
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    
    // Encontrar e remover o aluno de todas as salas da empresa
    const updatedRooms = allRooms.map((room: any) => {
      if (room.companyId === currentUser?.companyId && room.students) {
        room.students = room.students.filter((student: Student) => student.id !== id);
      }
      return room;
    });

    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
    loadStudents();
    
    toast({
      title: "Sucesso",
      description: "Aluno excluído com sucesso!",
    });
  };

  const handleTransferStudent = (studentId: string, newRoomId: string) => {
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    let studentToTransfer: Student | null = null;
    let oldRoomId: string | null = null;

    // Encontrar o aluno e sua sala atual
    allRooms.forEach((room: any) => {
      if (room.students) {
        const student = room.students.find((s: Student) => s.id === studentId);
        if (student) {
          studentToTransfer = student;
          oldRoomId = room.id;
        }
      }
    });

    if (!studentToTransfer || !oldRoomId) return;

    // Atualizar as salas
    const updatedRooms = allRooms.map((room: any) => {
      if (room.id === oldRoomId) {
        // Remover o aluno da sala antiga
        room.students = room.students.filter((s: Student) => s.id !== studentId);
      }
      if (room.id === newRoomId) {
        // Adicionar o aluno à nova sala
        const updatedStudent = { ...studentToTransfer, room: newRoomId };
        room.students = [...(room.students || []), updatedStudent];
      }
      return room;
    });

    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
    loadStudents();

    toast({
      title: "Sucesso",
      description: "Aluno transferido com sucesso!",
    });
  };

  const filteredStudents = students.filter((student) => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Alunos Total</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar alunos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <StudentTable 
                students={filteredStudents}
                rooms={rooms}
                onDeleteStudent={handleDeleteStudent}
                onTransferStudent={handleTransferStudent}
                showTransferOption={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminStudentsTotal;