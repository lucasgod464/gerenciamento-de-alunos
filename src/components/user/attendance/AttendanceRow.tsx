import { CircleCheck, CircleX, Clock, FileQuestion } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AttendanceRowProps {
  student: {
    id: string;
    name: string;
    status?: string;
  };
  observation: string;
  onStatusChange: (id: string, status: string) => void;
  onObservationChange: (id: string, text: string) => void;
}

const getStatusIcon = (status?: string) => {
  switch (status) {
    case "present":
      return <CircleCheck className="h-4 w-4 text-green-500" />;
    case "absent":
      return <CircleX className="h-4 w-4 text-red-500" />;
    case "late":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "justified":
      return <FileQuestion className="h-4 w-4 text-blue-500" />;
    default:
      return null;
  }
};

export const AttendanceRow = ({
  student,
  observation,
  onStatusChange,
  onObservationChange,
}: AttendanceRowProps) => {
  return (
    <div className="grid grid-cols-12 gap-4 items-center p-4 border rounded-lg bg-white">
      <div className="col-span-3 flex items-center gap-2">
        {getStatusIcon(student.status)}
        <span className="font-medium">{student.name}</span>
      </div>
      
      <div className="col-span-3">
        <Select
          value={student.status}
          onValueChange={(value) => onStatusChange(student.id, value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="present">
              <div className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 text-green-500 shrink-0" />
                <span className="text-green-600">Presente</span>
              </div>
            </SelectItem>
            <SelectItem value="absent">
              <div className="flex items-center gap-2">
                <CircleX className="h-4 w-4 text-red-500 shrink-0" />
                <span className="text-red-600">Ausente</span>
              </div>
            </SelectItem>
            <SelectItem value="late">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500 shrink-0" />
                <span className="text-yellow-600">Atrasado</span>
              </div>
            </SelectItem>
            <SelectItem value="justified">
              <div className="flex items-center gap-2">
                <FileQuestion className="h-4 w-4 text-blue-500 shrink-0" />
                <span className="text-blue-600">Justificado</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="col-span-6">
        <Textarea
          placeholder="Observações (opcional)"
          value={observation}
          onChange={(e) => onObservationChange(student.id, e.target.value)}
          className="h-10 min-h-0 resize-none"
          maxLength={500}
        />
      </div>
    </div>
  );
};
