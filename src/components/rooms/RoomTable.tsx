import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { Room } from "@/types/room";
import { RoomStudentsDialog } from "./RoomStudentsDialog";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Student } from "@/types/student";
import { useToast } from "@/hooks/use-toast";
import { RoomTableHeader } from "./table/RoomTableHeader";
import { RoomTableRow } from "./table/RoomTableRow";
import { supabase } from "@/integrations/supabase/client";

interface RoomTableProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (id: string) => void;
}

export function RoomTable({ rooms, onEdit, onDelete }: RoomTableProps) {
  const [selectedRoomStudents, setSelectedRoomStudents] = useState<Student[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [isStudentsDialogOpen, setIsStudentsDialogOpen] = useState(false);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const handleShowStudents = async (room: Room) => {
    try {
      const { data: roomStudents, error } = await supabase
        .from('room_students')
        .select(`
          student_id,
          students:student_id (
            id,
            name,
            birthDate:birth_date,
            status,
            created_at
          )
        `)
        .eq('room_id', room.id);

      if (error) throw error;

      const studentsList: Student[] = roomStudents.map(rs => ({
        id: rs.students.id,
        name: rs.students.name,
        birthDate: rs.students.birthDate,
        room: room.id,
        status: rs.students.status as 'active' | 'inactive',
        createdAt: new Date(rs.students.created_at).toLocaleDateString(),
        companyId: currentUser?.companyId || null
      }));
    
      setSelectedRoomStudents(studentsList);
      setSelectedRoomId(room.id);
      setIsStudentsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar alunos",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      const { error } = await supabase
        .from('room_students')
        .delete()
        .eq('room_id', selectedRoomId)
        .eq('student_id', studentId);

      if (error) throw error;

      setSelectedRoomStudents(prev => prev.filter(student => student.id !== studentId));

      toast({
        title: "Sucesso",
        description: "Aluno excluído com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir aluno",
        variant: "destructive",
      });
    }
  };

  const handleTransferStudent = async (studentId: string, newRoomId: string) => {
    try {
      // Remove from current room
      const { error: deleteError } = await supabase
        .from('room_students')
        .delete()
        .eq('room_id', selectedRoomId)
        .eq('student_id', studentId);

      if (deleteError) throw deleteError;

      // Add to new room
      const { error: insertError } = await supabase
        .from('room_students')
        .insert({
          room_id: newRoomId,
          student_id: studentId
        });

      if (insertError) throw insertError;

      if (selectedRoomId === newRoomId) {
        // Refresh students list if transferring within the same room
        const { data: newRoomStudents, error: fetchError } = await supabase
          .from('room_students')
          .select('student_id')
          .eq('room_id', newRoomId);

        if (fetchError) throw fetchError;

        setSelectedRoomStudents(newRoomStudents.map(s => ({ id: s.student_id })));
      } else {
        // Remove from current view if transferring to different room
        setSelectedRoomStudents(prev => prev.filter(student => student.id !== studentId));
      }

      toast({
        title: "Sucesso",
        description: "Aluno transferido com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao transferir aluno:", error);
      toast({
        title: "Erro",
        description: "Erro ao transferir aluno",
        variant: "destructive",
      });
    }
  };

  const getAuthorizedUserNames = async (room: Room) => {
    if (!currentUser?.companyId) return "Nenhum usuário vinculado";

    try {
      const { data: authorizedUsers, error } = await supabase
        .from('room_authorized_users')
        .select('users (name)')
        .eq('room_id', room.id);

      if (error) throw error;

      if (!authorizedUsers || authorizedUsers.length === 0) {
        return "Nenhum usuário vinculado";
      }

      return authorizedUsers
        .map(auth => auth.users?.name)
        .filter(Boolean)
        .join(", ");
    } catch (error) {
      console.error("Erro ao buscar usuários autorizados:", error);
      return "Erro ao carregar usuários";
    }
  };

  return (
    <>
      <Table>
        <RoomTableHeader />
        <TableBody>
          {rooms.map((room) => (
            <RoomTableRow
              key={room.id}
              room={room}
              onEdit={onEdit}
              onDelete={onDelete}
              onShowStudents={handleShowStudents}
            />
          ))}
        </TableBody>
      </Table>

      <RoomStudentsDialog
        open={isStudentsDialogOpen}
        onOpenChange={setIsStudentsDialogOpen}
        students={selectedRoomStudents}
        rooms={rooms}
        currentRoomId={selectedRoomId}
        onDeleteStudent={handleDeleteStudent}
        onTransferStudent={handleTransferStudent}
      />
    </>
  );
}