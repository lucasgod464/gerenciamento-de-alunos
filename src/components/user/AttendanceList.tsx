import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student } from "@/types/attendance";
import { useToast } from "@/hooks/use-toast";

interface AttendanceListProps {
  students: Student[];
  onStatusChange: (studentId: string, status: Student["status"]) => void;
  date: Date;
}

export const AttendanceList = ({ students, onStatusChange, date }: AttendanceListProps) => {
  const { toast } = useToast();

  const handleStatusChange = (studentId: string, status: Student["status"]) => {
    onStatusChange(studentId, status);
    toast({
      title: "Status atualizado",
      description: "O status de presença foi atualizado com sucesso."
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Sala</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>{student.name}</TableCell>
            <TableCell>{student.room}</TableCell>
            <TableCell>
              <Select
                value={student.status}
                onValueChange={(value: Student["status"]) =>
                  handleStatusChange(student.id, value)
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Presente</SelectItem>
                  <SelectItem value="absent">Ausente</SelectItem>
                  <SelectItem value="late">Atrasado</SelectItem>
                  <SelectItem value="justified">Justificado</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};