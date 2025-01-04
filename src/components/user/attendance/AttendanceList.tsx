import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/utils/dateUtils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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

  const handleSave = async () => {
    try {
      const formattedDate = formatDate(date);
      
      // Salvar status de presença
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
      
      // Salvar observações
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
          
          <div className="space-y-6">
            {students.map((student) => (
              <div key={student.id} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{student.name}</h4>
                    <RadioGroup
                      value={student.status}
                      onValueChange={(value) => handleStatusChange(student.id, value)}
                      className="flex space-x-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="present" id={`present-${student.id}`} />
                        <Label htmlFor={`present-${student.id}`} className="text-green-600">Presente</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="absent" id={`absent-${student.id}`} />
                        <Label htmlFor={`absent-${student.id}`} className="text-red-600">Ausente</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="late" id={`late-${student.id}`} />
                        <Label htmlFor={`late-${student.id}`} className="text-yellow-600">Atrasado</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="justified" id={`justified-${student.id}`} />
                        <Label htmlFor={`justified-${student.id}`} className="text-blue-600">Justificado</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <Textarea
                  placeholder="Observações (opcional)"
                  value={observations[student.id] || ''}
                  onChange={(e) => handleObservationChange(student.id, e.target.value)}
                  className="h-20"
                  maxLength={500}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};