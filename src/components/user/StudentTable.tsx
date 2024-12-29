import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Student } from "@/types/student";
import { format } from "date-fns";

interface StudentTableProps {
  students: Student[];
  rooms: { id: string; name: string; }[];
  onDeleteStudent: (id: string) => void;
  onTransferStudent?: (studentId: string, newRoomId: string) => void;
  currentRoomId?: string;
}

export function StudentTable({
  students,
  rooms,
  onDeleteStudent,
  onTransferStudent,
  currentRoomId
}: StudentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Data de Nascimento</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>{student.name}</TableCell>
            <TableCell>{student.email}</TableCell>
            <TableCell>{format(new Date(student.birthDate), 'dd/MM/yyyy')}</TableCell>
            <TableCell>
              <Button onClick={() => onDeleteStudent(student.id)}>Excluir</Button>
              {currentRoomId && (
                <Button onClick={() => onTransferStudent?.(student.id, currentRoomId)}>Transferir</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
