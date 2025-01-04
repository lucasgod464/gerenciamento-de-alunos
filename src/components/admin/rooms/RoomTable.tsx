import { Table, TableBody } from "@/components/ui/table";
import { Room } from "@/types/room";
import { RoomStudentsDialog } from "@/components/rooms/RoomStudentsDialog";
import { useState } from "react";
import { Student, mapSupabaseStudentToStudent } from "@/types/student";
import { useToast } from "@/hooks/use-toast";
import { RoomTableHeader } from "@/components/rooms/table/RoomTableHeader";
import { RoomTableRow } from "@/components/rooms/table/RoomTableRow";
import { supabase } from "@/integrations/supabase/client";

interface RoomTableProps {
  rooms: Room[];
  onUpdateRoom: (room: Room) => void;
  onDeleteRoom: (id: string) => void;
}

export function RoomTable({ rooms, onUpdateRoom, onDeleteRoom }: RoomTableProps) {
  const [selectedRoomStudents, setSelectedRoomStudents] = useState<Student[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [isStudentsDialogOpen, setIsStudentsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleShowStudents = async (room: Room) => {
    try {
      const { data: roomStudents, error } = await supabase
        .from('room_students')
        .select(`
          student:students (
            id,
            name,
            birth_date,
            status,
            email,
            document,
            address,
            custom_fields,
            company_id,
            created_at
          )
        `)
        .eq('room_id', room.id);

      if (error) {
        console.error('Error fetching students:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar alunos",
          variant: "destructive",
        });
        return;
      }

      if (!roomStudents) {
        setSelectedRoomStudents([]);
        return;
      }

      const studentsList: Student[] = roomStudents
        .filter(rs => rs.student && typeof rs.student === 'object')
        .map(rs => mapSupabaseStudentToStudent(rs.student as any));
    
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
      const { error: deleteError } = await supabase
        .from('room_students')
        .delete()
        .eq('room_id', selectedRoomId)
        .eq('student_id', studentId);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from('room_students')
        .insert({
          room_id: newRoomId,
          student_id: studentId
        });

      if (insertError) throw insertError;

      setSelectedRoomStudents(prev => prev.filter(student => student.id !== studentId));

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

  return (
    <>
      <Table>
        <RoomTableHeader />
        <TableBody>
          {rooms?.map((room) => (
            <RoomTableRow
              key={room.id}
              room={room}
              onEdit={onUpdateRoom}
              onDelete={onDeleteRoom}
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