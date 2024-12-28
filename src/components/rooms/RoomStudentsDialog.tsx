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
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser?.companyId || !room) return;

    // Carregar salas
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const companyRooms = allRooms.filter(
      (r: Room) => r.companyId === currentUser.companyId
    );
    setRooms(companyRooms);

    // Carregar alunos da sala específica
    const currentRoom = companyRooms.find((r: Room) => r.id === room.id);
    if (currentRoom && currentRoom.students) {
      const roomStudents = currentRoom.students.map((student: any) => ({
        ...student,
        birthDate: student.birthDate || "",
        room: student.room || room.id,
        createdAt: student.createdAt || new Date().toISOString(),
      }));
      setStudents(roomStudents.filter((student: Student) => 
        student.companyId === currentUser.companyId
      ));
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

  const handleTransferStudent = (studentId: string, newRoomId: string) => {
    if (!room || !currentUser?.companyId) return;

    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const studentToTransfer = students.find(s => s.id === studentId);

    if (!studentToTransfer) return;

    // Remove student from current room
    const updatedRooms = allRooms.map((r: Room) => {
      if (r.id === room.id) {
        return {
          ...r,
          students: (r.students || []).filter((s: Student) => s.id !== studentId)
        };
      }
      // Add student to new room
      if (r.id === newRoomId) {
        const updatedStudent = {
          ...studentToTransfer,
          room: newRoomId
        };
        return {
          ...r,
          students: [...(r.students || []), updatedStudent]
        };
      }
      return r;
    });

    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
    
    // Update local state
    setStudents(prev => prev.filter(s => s.id !== studentId));

    toast({
      title: "Aluno transferido",
      description: "O aluno foi transferido para a nova sala com sucesso.",
    });
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
            rooms={rooms.filter(r => r.id !== room?.id)} // Exclude current room
            onDeleteStudent={handleDeleteStudent}
            onTransferStudent={handleTransferStudent}
            currentRoomId={room?.id}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}