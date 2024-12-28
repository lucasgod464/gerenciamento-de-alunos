import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Student } from "@/types/student";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudentTableProps {
  students: Student[];
  rooms: { id: string; name: string }[];
  onDeleteStudent: (id: string) => void;
  onTransferStudent: (studentId: string, newRoomId: string) => void;
  currentRoomId?: string;
}

export function StudentTable({
  students,
  rooms,
  onDeleteStudent,
  onTransferStudent,
  currentRoomId,
}: StudentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Data de Nascimento</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Transferir para</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>{student.name}</TableCell>
            <TableCell>{student.birthDate}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  student.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {student.status === "active" ? "Ativo" : "Inativo"}
              </span>
            </TableCell>
            <TableCell>
              <Select
                onValueChange={(value) => onTransferStudent(student.id, value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Transferir aluno" />
                </SelectTrigger>
                <SelectContent>
                  {rooms
                    .filter((room) => room.id !== currentRoomId)
                    .map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteStudent(student.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}