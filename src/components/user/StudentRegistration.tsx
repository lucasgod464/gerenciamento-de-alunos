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
    
    // Load all students from localStorage
    const savedStudents = localStorage.getItem("students");
    if (savedStudents) {
      const allStudents = JSON.parse(savedStudents);
      // Filter students by company
      const companyStudents = allStudents.filter(
        (student: Student) => student.companyId === currentUser.companyId
      );
      setStudents(companyStudents);
    }
  };

  useEffect(() => {
    if (!currentUser?.companyId) return;

    // Initial load of students
    loadStudents();

    // Load rooms
    const storedRooms = localStorage.getItem("rooms");
    if (storedRooms) {
      const allRooms = JSON.parse(storedRooms);
      const companyRooms = allRooms.filter(
        (room: any) => room.companyId === currentUser.companyId
      );
      setRooms(companyRooms);
    }

    // Add event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "students") {
        loadStudents();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentUser]);

  const handleAddStudent = (newStudent: Student) => {
    if (!currentUser?.companyId) return;

    const savedStudents = localStorage.getItem("students") || "[]";
    const allStudents = JSON.parse(savedStudents);
    
    // Add the new student with company ID
    const studentWithCompany = {
      ...newStudent,
      companyId: currentUser.companyId,
    };
    
    // Add to all students
    const updatedStudents = [...allStudents, studentWithCompany];
    
    // Save to localStorage
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    
    // Update local state with company's students
    setStudents(prev => [...prev, studentWithCompany]);

    toast({
      title: "Sucesso",
      description: "Aluno cadastrado com sucesso!",
    });
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name && student.email 
      ? (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         student.email.toLowerCase().includes(searchTerm.toLowerCase()))
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
      <StudentTable students={filteredStudents} rooms={rooms} />
    </div>
  );
};