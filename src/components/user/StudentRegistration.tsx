import { useState, useEffect } from "react";
import { StudentForm } from "./StudentForm";
import { StudentTable } from "./StudentTable";
import { Student } from "@/types/student";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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

  useEffect(() => {
    if (!currentUser?.companyId) return;

    const savedStudents = localStorage.getItem("students");
    if (savedStudents) {
      const allStudents = JSON.parse(savedStudents);
      const companyStudents = allStudents.filter(
        (student: Student) => student.companyId === currentUser.companyId
      );
      setStudents(companyStudents);
    }

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
    const updatedStudent = {
      ...newStudent,
      companyId: currentUser?.companyId || null,
    };
    
    const updatedStudents = [...students, updatedStudent];
    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      ((student.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || "").toLowerCase().includes(searchTerm.toLowerCase()));
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
      <StudentTable students={filteredStudents} />
    </div>
  );
};