import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StudentTable } from "@/components/user/StudentTable";
import { Room } from "@/types/room";
import { Student } from "@/types/student";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface RoomStudentsDialogProps {
  room: Room | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoomStudentsDialog({
  room,
  isOpen,
  onOpenChange,
}: RoomStudentsDialogProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId || !room) return;

    // Carregar todas as salas se for admin, ou apenas as da empresa se for usuário comum
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const filteredRooms = currentUser.role === "ADMIN" 
      ? allRooms
      : allRooms.filter((r: Room) => r.companyId === currentUser.companyId);
    
    setRooms(filteredRooms);

    // Carregar alunos da sala específica
    const currentRoom = allRooms.find((r: Room) => r.id === room.id);
    if (currentRoom && currentRoom.students) {
      const roomStudents = currentRoom.students.map((student: Student) => ({
        ...student,
        birthDate: student.birthDate || "",
        room: student.room || room.id,
        createdAt: student.createdAt || new Date().toISOString(),
      }));
      
      // Filtrar alunos por empresa apenas se não for admin
      const filteredStudents = currentUser.role === "ADMIN"
        ? roomStudents
        : roomStudents.filter((student: Student) => student.companyId === currentUser.companyId);
      
      setStudents(filteredStudents);
    } else {
      setStudents([]);
    }
  }, [currentUser, room]);

  const handleDeleteStudent = (id: string) => {
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    
    const updatedRooms = allRooms.map((r: Room) => {
      if (r.id === room?.id) {
        return {
          ...r,
          students: (r.students || []).filter((student: Student) => student.id !== id)
        };
      }
      return r;
    });

    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    
    // Se o aluno mudou de sala
    if (updatedStudent.room !== room?.id) {
      // Remover o aluno da sala atual
      const updatedRooms = allRooms.map((r: Room) => {
        if (r.id === room?.id) {
          return {
            ...r,
            students: (r.students || []).filter((s: Student) => s.id !== updatedStudent.id)
          };
        }
        // Adicionar o aluno à nova sala
        if (r.id === updatedStudent.room) {
          const existingStudents = r.students || [];
          return {
            ...r,
            students: [...existingStudents, updatedStudent]
          };
        }
        return r;
      });

      localStorage.setItem("rooms", JSON.stringify(updatedRooms));
      // Atualizar a lista de alunos removendo o que mudou de sala
      setStudents(prev => prev.filter(s => s.id !== updatedStudent.id));
    } else {
      // Atualização normal sem mudança de sala
      const updatedRooms = allRooms.map((r: Room) => {
        if (r.id === room?.id) {
          return {
            ...r,
            students: (r.students || []).map((student: Student) =>
              student.id === updatedStudent.id ? updatedStudent : student
            )
          };
        }
        return r;
      });

      localStorage.setItem("rooms", JSON.stringify(updatedRooms));
      setStudents(prev =>
        prev.map(student =>
          student.id === updatedStudent.id ? updatedStudent : student
        )
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Alunos da Sala: {room?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <StudentTable
            students={students}
            rooms={rooms}
            onDeleteStudent={handleDeleteStudent}
            onUpdateStudent={handleUpdateStudent}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}