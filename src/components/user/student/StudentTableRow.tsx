import { TableCell, TableRow } from "@/components/ui/table";
import { Student } from "@/types/student";
import { format } from "date-fns";
import { StudentTableActions } from "./StudentTableActions";
import { Badge } from "@/components/ui/badge";

interface StudentTableRowProps {
  student: Student;
  rooms: { id: string; name: string }[];
  onDelete: (id: string) => void;
  onTransfer: (studentId: string, newRoomId: string) => void;
  onUpdate: (student: Student) => void;
  showTransferOption: boolean;
}

export function StudentTableRow({
  student,
  rooms,
  onDelete,
  onTransfer,
  onUpdate,
  showTransferOption,
}: StudentTableRowProps) {
  const currentRoom = rooms.find(room => room.id === student.room);

  return (
    <TableRow>
      <TableCell>{student.name}</TableCell>
      <TableCell>
        {format(new Date(student.birthDate), 'dd/MM/yyyy')}
      </TableCell>
      <TableCell>{currentRoom?.name || 'Sem sala'}</TableCell>
      <TableCell>
        <Badge variant={student.status ? "default" : "secondary"}>
          {student.status ? "Ativo" : "Inativo"}
        </Badge>
      </TableCell>
      <TableCell>
        <StudentTableActions
          student={student}
          rooms={rooms}
          onDeleteClick={onDelete}
          onTransferStudent={onTransfer}
          onEditClick={onUpdate}
          showTransferOption={showTransferOption}
        />
      </TableCell>
    </TableRow>
  );
}