import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Student } from "@/types/student";
import { StudentTableRow } from "./student/StudentTableRow";

interface StudentTableProps {
  students: Student[];
  rooms: { id: string; name: string }[];
  onDeleteStudent: (id: string) => void;
  onTransferStudent: (studentId: string, newRoomId: string) => void;
  onUpdateStudent: (student: Student) => void;
  showTransferOption?: boolean;
}

export function StudentTable({
  students,
  rooms,
  onDeleteStudent,
  onTransferStudent,
  onUpdateStudent,
  showTransferOption = false,
}: StudentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Nome</TableHead>
          <TableHead>Data de Nascimento</TableHead>
          <TableHead>Sala</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <StudentTableRow
            key={student.id}
            student={student}
            rooms={rooms}
            onDelete={onDeleteStudent}
            onTransfer={onTransferStudent}
            onUpdate={onUpdateStudent}
            showTransferOption={showTransferOption}
          />
        ))}
        {students.length === 0 && (
          <TableRow>
            <TableHead colSpan={5} className="text-center h-24 text-muted-foreground">
              Nenhum aluno encontrado
            </TableHead>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
