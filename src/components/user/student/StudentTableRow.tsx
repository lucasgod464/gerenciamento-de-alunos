import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Student } from "@/types/student";
import { StudentTableActions } from "../StudentTableActions";
import { StudentInfoDialog } from "../StudentInfoDialog";

interface StudentTableRowProps {
  student: Student;
  rooms: { id: string; name: string }[];
  onDelete: (id: string) => void;
  onTransfer: (studentId: string, newRoomId: string) => void;
  onUpdate: (student: Student) => void;
  showTransferOption?: boolean;
}

export function StudentTableRow({
  student,
  rooms,
  onDelete,
  onTransfer,
  onUpdate,
  showTransferOption = false,
}: StudentTableRowProps) {
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const currentRoom = rooms.find(room => room.id === student.room);

  return (
    <>
      <TableRow>
        <TableCell>{student.name}</TableCell>
        <TableCell>{student.birthDate}</TableCell>
        <TableCell>
          {currentRoom ? (
            <Badge variant="secondary">{currentRoom.name}</Badge>
          ) : (
            <Badge variant="outline">Sem sala</Badge>
          )}
        </TableCell>
        <TableCell>
          <Badge variant={student.status ? "default" : "destructive"}>
            {student.status ? "Ativo" : "Inativo"}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <StudentTableActions
            student={student}
            rooms={rooms}
            onDeleteClick={onDelete}
            onTransferStudent={onTransfer}
            onEditClick={onUpdate}
            onInfoClick={() => setShowInfoDialog(true)}
            showTransferOption={showTransferOption}
          />
        </TableCell>
      </TableRow>

      <StudentInfoDialog
        student={showInfoDialog ? student : null}
        onClose={() => setShowInfoDialog(false)}
      />
    </>
  );
}