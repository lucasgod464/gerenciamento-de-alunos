import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/utils/dateUtils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CircleCheck, CircleX, Clock, FileQuestion } from "lucide-react";

interface Student {
  id: string;
  name: string;
  status?: string;
  observation?: string;
}

interface AttendanceListProps {
  date: Date;
  roomId: string;
  companyId: string;
  onAttendanceSaved: () => void;
}

export const AttendanceList = ({ date, roomId, companyId, onAttendanceSaved }: AttendanceListProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [observations, setObservations] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from('room_students')
        .select(`
          student_id,
          students (
            id,
            name
          )
        `)
        .eq('room_id', roomId);

      if (error) {
        console.error('Erro ao buscar alunos:', error);
        return;
      }

      const formattedStudents = data.map(item => ({
        id: item.students.id,
        name: item.students.name,
        status: 'present'
      }));

      setStudents(formattedStudents);
    };

    if (roomId) {
      fetchStudents();
    }
  }, [roomId]);

  const handleStatusChange = (studentId: string, status: string) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const handleObservationChange = (studentId: string, text: string) => {
    setObservations(prev => ({
      ...prev,
      [studentId]: text
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CircleCheck className="h-4 w-4 text-green-500" />;
      case 'absent':
        return <CircleX className="h-4 w-4 text-red-500" />;
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'justified':
        return <FileQuestion className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const handleSave = async () => {
    try {
      const formattedDate = formatDate(date);
      
      const attendancePromises = students.map(student => 
        supabase
          .from('daily_attendance')
          .upsert({
            date: formattedDate,
            student_id: student.id,
            status: student.status,
            company_id: companyId,
            room_id: roomId
          })
      );

      await Promise.all(attendancePromises);
      
      const observationEntries = Object.entries(observations);
      if (observationEntries.length > 0) {
        const { error: obsError } = await supabase
          .from('daily_observations')
          .upsert(
            observationEntries.map(([studentId, text]) => ({
              date: formattedDate,
              text,
              company_id: companyId,
              student_id: studentId
            }))
          );

        if (obsError) throw obsError;
      }

      onAttendanceSaved();
      
      toast({
        title: "Presença registrada",
        description: "Os dados foram salvos com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados de presença.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Lista de Alunos</h3>
            <Button onClick={handleSave}>Salvar Chamada</Button>
          </div>
          
          <div className="space-y-4">
            {students.map((student) => (
              <div key={student.id} className="p-4 border rounded-lg bg-white shadow-sm">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-lg">{student.name}</h4>
                    <div className="w-[200px]">
                      <Select
                        value={student.status}
                        onValueChange={(value) => handleStatusChange(student.id, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present" className="flex items-center gap-2">
                            <CircleCheck className="h-4 w-4 text-green-500" />
                            <span className="text-green-600">Presente</span>
                          </SelectItem>
                          <SelectItem value="absent" className="flex items-center gap-2">
                            <CircleX className="h-4 w-4 text-red-500" />
                            <span className="text-red-600">Ausente</span>
                          </SelectItem>
                          <SelectItem value="late" className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <span className="text-yellow-600">Atrasado</span>
                          </SelectItem>
                          <SelectItem value="justified" className="flex items-center gap-2">
                            <FileQuestion className="h-4 w-4 text-blue-500" />
                            <span className="text-blue-600">Justificado</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`obs-${student.id}`} className="text-sm text-gray-600">
                      Observações
                    </Label>
                    <Textarea
                      id={`obs-${student.id}`}
                      placeholder="Adicione observações (opcional)"
                      value={observations[student.id] || ''}
                      onChange={(e) => handleObservationChange(student.id, e.target.value)}
                      className="mt-1"
                      maxLength={500}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};