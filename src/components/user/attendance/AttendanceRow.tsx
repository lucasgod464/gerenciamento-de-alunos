import { Student } from "@/types/student";
import { formatDisplayDate } from "@/utils/dateUtils";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface AttendanceRowProps {
  student: Student;
  observation: string;
  onStatusChange: (studentId: string, status: string) => void;
  onObservationChange: (studentId: string, text: string) => void;
}

export const AttendanceRow = ({
  student,
  observation,
  onStatusChange,
  onObservationChange,
}: AttendanceRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{student.name}</TableCell>
      <TableCell>
        <RadioGroup
          defaultValue={student.status || 'present'}
          onValueChange={(value) => onStatusChange(student.id, value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="present" id={`present-${student.id}`} />
            <Label htmlFor={`present-${student.id}`}>Presente</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="absent" id={`absent-${student.id}`} />
            <Label htmlFor={`absent-${student.id}`}>Falta</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="late" id={`late-${student.id}`} />
            <Label htmlFor={`late-${student.id}`}>Atrasado</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="justified" id={`justified-${student.id}`} />
            <Label htmlFor={`justified-${student.id}`}>Justificado</Label>
          </div>
        </RadioGroup>
      </TableCell>
      <TableCell>
        <Textarea
          value={observation}
          onChange={(e) => onObservationChange(student.id, e.target.value)}
          placeholder="Observações..."
          className="min-h-[80px]"
        />
      </TableCell>
    </TableRow>
  );
};