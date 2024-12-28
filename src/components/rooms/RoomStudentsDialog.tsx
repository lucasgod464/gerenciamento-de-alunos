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
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId || !room) return;

    // Carregar salas
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const companyRooms = allRooms.filter(
      (r: Room) => r.companyId === currentUser.companyId
    );
    setRooms(companyRooms);

    // Carregar alunos da sala específica
    const roomStudents = companyRooms
      .find((r: Room) => r.id === room.id)
      ?.students || [];
    
    setStudents(roomStudents.filter((student: Student) => 
      student.companyId === currentUser.companyId
    ));
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
    
    // Atualizar a lista local de alunos
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    
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
    
    // Atualizar a lista local de alunos
    setStudents(prev =>
      prev.map(student =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
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