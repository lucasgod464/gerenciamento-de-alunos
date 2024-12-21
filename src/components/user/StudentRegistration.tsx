import { useState, useEffect } from "react";
import { AddStudentDialog } from "./AddStudentDialog";
import { StudentTable } from "./StudentTable";
import { Student } from "@/types/student";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const StudentRegistration = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const loadStudents = () => {
    if (!currentUser?.companyId) return;
    
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    
    // Filtrar apenas as salas da empresa atual
    const companyRooms = allRooms.filter(
      (room: any) => room.companyId === currentUser.companyId
    );

    // Coletar todos os alunos das salas da empresa
    const companyStudents: Student[] = [];
    companyRooms.forEach((room: any) => {
      if (room.students && Array.isArray(room.students)) {
        const roomStudents = room.students.filter((student: any) => 
          typeof student === 'object' && student.companyId === currentUser.companyId
        );
        companyStudents.push(...roomStudents);
      }
    });

    setStudents(companyStudents);
    setRooms(companyRooms);
  };

  useEffect(() => {
    loadStudents();
  }, [currentUser]);

  const handleAddStudent = (newStudent: Student) => {
    loadStudents(); // Recarregar a lista de alunos após adicionar um novo
    
    toast({
      title: "Sucesso",
      description: "Aluno cadastrado com sucesso!",
    });
  };

  const handleDeleteStudent = (id: string) => {
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    
    // Encontrar e remover o aluno apenas das salas da empresa atual
    const updatedRooms = allRooms.map((room: any) => {
      if (room.companyId === currentUser?.companyId && room.students) {
        room.students = room.students.filter((student: Student) => student.id !== id);
      }
      return room;
    });

    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
    loadStudents(); // Recarregar a lista de alunos após deletar
    
    toast({
      title: "Sucesso",
      description: "Aluno excluído com sucesso!",
    });
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    
    // Atualizar o aluno apenas nas salas da empresa atual
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
    loadStudents(); // Recarregar a lista de alunos após atualizar
    
    toast({
      title: "Sucesso",
      description: "Aluno atualizado com sucesso!",
    });
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      ? student.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const matchesRoom = selectedRoom === "all" || student.room === selectedRoom;
    return matchesSearch && matchesRoom;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="grid gap-4 md:grid-cols-2 flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar alunos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por sala" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as salas</SelectItem>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AddStudentDialog onStudentAdded={handleAddStudent} />
      </div>
      <StudentTable 
        students={filteredStudents} 
        rooms={rooms} 
        onDeleteStudent={handleDeleteStudent}
        onUpdateStudent={handleUpdateStudent}
      />
    </div>
  );
};