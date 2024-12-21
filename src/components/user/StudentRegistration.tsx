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
    
    const savedRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const companyRooms = savedRooms.filter(
      (room: any) => room.companyId === currentUser.companyId
    );
    
    // Coletar todos os alunos de todas as salas da empresa
    const allStudents: Student[] = [];
    companyRooms.forEach((room: any) => {
      if (room.students) {
        room.students.forEach((studentId: string) => {
          // Adicionar o aluno apenas se ele ainda não estiver na lista
          if (!allStudents.find(s => s.id === studentId)) {
            allStudents.push({
              id: studentId,
              name: studentId, // Aqui você precisaria buscar os detalhes do aluno da sala
              room: room.id,
              status: "active",
              birthDate: "",
              createdAt: "",
              companyId: currentUser.companyId
            });
          }
        });
      }
    });
    
    setStudents(allStudents);
  };

  useEffect(() => {
    if (!currentUser?.companyId) return;

    loadStudents();

    const storedRooms = localStorage.getItem("rooms");
    if (storedRooms) {
      const allRooms = JSON.parse(storedRooms);
      const companyRooms = allRooms.filter(
        (room: any) => room.companyId === currentUser.companyId
      );
      setRooms(companyRooms);
    }
  }, [currentUser]);

  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
    toast({
      title: "Sucesso",
      description: "Aluno cadastrado com sucesso!",
    });
  };

  const handleDeleteStudent = (id: string) => {
    // Remover o aluno de todas as salas
    const savedRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const updatedRooms = savedRooms.map((room: any) => {
      if (room.students) {
        room.students = room.students.filter((studentId: string) => studentId !== id);
      }
      return room;
    });
    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
    
    setStudents(prev => prev.filter(student => student.id !== id));
    
    toast({
      title: "Sucesso",
      description: "Aluno excluído com sucesso!",
    });
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(student => 
      student.id === updatedStudent.id ? updatedStudent : student
    ));
    
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