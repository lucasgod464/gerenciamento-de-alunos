import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Student } from "@/types/student";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AttendanceListProps {
  students: Student[];
  date: Date;
  onSave: () => void;
  disabled?: boolean;
}

type AttendanceStatus = "present" | "absent" | "late" | "justified";

interface StudentAttendance {
  studentId: string;
  status: AttendanceStatus;
  observation: string;
}

export function AttendanceList({ students, date, onSave, disabled }: AttendanceListProps) {
  const [attendanceData, setAttendanceData] = useState<StudentAttendance[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => {
      const existing = prev.find(a => a.studentId === studentId);
      if (existing) {
        return prev.map(a => a.studentId === studentId ? { ...a, status } : a);
      }
      return [...prev, { studentId, status, observation: "" }];
    });
  };

  const handleObservationChange = (studentId: string, observation: string) => {
    setAttendanceData(prev => {
      const existing = prev.find(a => a.studentId === studentId);
      if (existing) {
        return prev.map(a => a.studentId === studentId ? { ...a, observation } : a);
      }
      return [...prev, { studentId, observation, status: "present" }];
    });
  };

  const handleSaveAttendance = async () => {
    if (!user?.companyId) return;

    try {
      const attendanceRecords = attendanceData.map(record => ({
        date: date.toISOString().split('T')[0],
        student_id: record.studentId,
        status: record.status,
        company_id: user.companyId
      }));

      const { error } = await supabase
        .from('daily_attendance')
        .upsert(attendanceRecords);

      if (error) throw error;

      toast({
        title: "Chamada salva com sucesso!",
        description: "Os registros de presença foram salvos.",
      });

      onSave();
    } catch (error) {
      console.error('Erro ao salvar chamada:', error);
      toast({
        title: "Erro ao salvar chamada",
        description: "Ocorreu um erro ao salvar os registros de presença.",
        variant: "destructive",
      });
    }
  };

  if (disabled) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          A chamada já foi realizada para esta data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Lista de Presença</h3>
        <Button onClick={handleSaveAttendance} disabled={attendanceData.length === 0}>
          Iniciar Chamada
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Aluno</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Observações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>
                <RadioGroup
                  onValueChange={(value) => handleStatusChange(student.id, value as AttendanceStatus)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="present" id={`present-${student.id}`} />
                    <Label htmlFor={`present-${student.id}`}>Presente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="absent" id={`absent-${student.id}`} />
                    <Label htmlFor={`absent-${student.id}`}>Ausente</Label>
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
                  placeholder="Observações sobre o aluno..."
                  onChange={(e) => handleObservationChange(student.id, e.target.value)}
                  className="min-h-[80px]"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}