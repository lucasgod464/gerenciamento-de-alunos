import { useEffect, useState } from "react";
import { AttendanceHeader } from "./AttendanceHeader";
import { AttendanceList } from "./AttendanceList";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AttendanceChart } from "./AttendanceChart";
import { Trash2, Play } from "lucide-react";

export function AttendanceControl() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [students, setStudents] = useState<Student[]>([]);
  const [hasAttendance, setHasAttendance] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchStudents = async () => {
    if (!user?.companyId) return;
    
    try {
      const { data: roomStudents, error } = await supabase
        .from('room_students')
        .select(`
          student:students (
            id,
            name,
            birth_date,
            status,
            email,
            document,
            address,
            custom_fields,
            company_id,
            created_at
          )
        `);

      if (error) throw error;

      const students = roomStudents
        .map(rs => rs.student)
        .filter((student): student is Student => student !== null);

      setStudents(students);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      toast({
        title: "Erro ao carregar alunos",
        description: "Não foi possível carregar a lista de alunos.",
        variant: "destructive",
      });
    }
  };

  const checkAttendance = async () => {
    if (!user?.companyId) return;
    
    try {
      const { data, error } = await supabase
        .from('daily_attendance')
        .select('id')
        .eq('date', selectedDate.toISOString().split('T')[0])
        .eq('company_id', user.companyId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setHasAttendance(!!data);
      setIsStarted(false);
    } catch (error) {
      console.error('Erro ao verificar chamada:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [user?.companyId]);

  useEffect(() => {
    checkAttendance();
  }, [selectedDate, user?.companyId]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setIsStarted(false);
  };

  const handleDeleteAttendance = async () => {
    if (!user?.companyId) return;
    
    try {
      const { error } = await supabase
        .from('daily_attendance')
        .delete()
        .eq('date', selectedDate.toISOString().split('T')[0])
        .eq('company_id', user.companyId);

      if (error) throw error;

      toast({
        title: "Chamada deletada",
        description: "A chamada foi deletada com sucesso.",
      });
      
      setHasAttendance(false);
      setIsStarted(false);
    } catch (error) {
      console.error('Erro ao deletar chamada:', error);
      toast({
        title: "Erro ao deletar chamada",
        description: "Não foi possível deletar a chamada.",
        variant: "destructive",
      });
    }
  };

  const handleAttendanceSaved = () => {
    setHasAttendance(true);
    setIsStarted(false);
    checkAttendance();
  };

  const handleStartAttendance = () => {
    setIsStarted(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Controle de Presença</h1>
          <p className="text-muted-foreground">
            Gerencie a presença dos seus alunos
          </p>
        </div>
        {hasAttendance ? (
          <Button
            variant="destructive"
            onClick={handleDeleteAttendance}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Deletar Chamada
          </Button>
        ) : (
          <Button
            onClick={handleStartAttendance}
            className="flex items-center gap-2"
            disabled={isStarted}
          >
            <Play className="h-4 w-4" />
            Iniciar Chamada
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4">
          <AttendanceHeader onDateChange={handleDateChange} />
        </Card>
        <Card className="p-4">
          <AttendanceChart date={selectedDate} />
        </Card>
      </div>
      
      {students.length > 0 && (
        <Card className="p-4">
          <AttendanceList
            students={students}
            date={selectedDate}
            onSave={handleAttendanceSaved}
            disabled={hasAttendance}
            isStarted={isStarted}
          />
        </Card>
      )}
    </div>
  );
}