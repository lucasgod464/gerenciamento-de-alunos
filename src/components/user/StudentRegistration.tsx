import { useState, useEffect } from "react";
import { StudentForm } from "./StudentForm";
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
    
    const savedStudents = localStorage.getItem("students");
    if (savedStudents) {
      const allStudents = JSON.parse(savedStudents);
      const companyStudents = allStudents.filter(
        (student: Student) => student.companyId === currentUser.companyId
      );
      setStudents(companyStudents);
    }
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
    if (!currentUser?.companyId) return;

    const savedStudents = localStorage.getItem("students") || "[]";
    const allStudents = JSON.parse(savedStudents);
    
    const studentWithCompany = {
      ...newStudent,
      companyId: currentUser.companyId,
    };
    
    allStudents.push(studentWithCompany);
    localStorage.setItem("students", JSON.stringify(allStudents));
    
    setStudents(prev => [...prev, studentWithCompany]);

    toast({
      title: "Sucesso",
      description: "Aluno cadastrado com sucesso!",
    });
  };

  const handleDeleteStudent = (id: string) => {
    const savedStudents = localStorage.getItem("students") || "[]";
    const allStudents = JSON.parse(savedStudents);
    const updatedStudents = allStudents.filter((student: Student) => student.id !== id);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    const savedStudents = localStorage.getItem("students") || "[]";
    const allStudents = JSON.parse(savedStudents);
    const updatedStudents = allStudents.map((student: Student) => 
      student.id === updatedStudent.id ? updatedStudent : student
    );
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    
    setStudents(prev => prev.map(student => 
      student.id === updatedStudent.id ? updatedStudent : student
    ));
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
      <div className="grid gap-4 md:grid-cols-2">
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
      <StudentForm onSubmit={handleAddStudent} />
      <StudentTable 
        students={filteredStudents} 
        rooms={rooms} 
        onDeleteStudent={handleDeleteStudent}
        onUpdateStudent={handleUpdateStudent}
      />
    </div>
  );
};