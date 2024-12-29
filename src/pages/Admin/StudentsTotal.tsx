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
        );
        allStudents.push(...roomStudents);
      }
    });

    setStudents(allStudents);
    setRooms(companyRooms);
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

  const handleUpdateStudent = (updatedStudent: Student) => {
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    
    // Atualizar o aluno na sala correta
    const updatedRooms = allRooms.map((room: any) => {
      if (room.companyId === currentUser?.companyId && 
          room.id === updatedStudent.room && 
          room.students) {
        room.students = room.students.map((student: Student) =>
          student.id === updatedStudent.id ? updatedStudent : student
        );
      }
      return room;
    });

    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
    loadStudents();
    
    toast({
      title: "Sucesso",
      description: "Aluno atualizado com sucesso!",
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
                onUpdateStudent={handleUpdateStudent}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminStudentsTotal;