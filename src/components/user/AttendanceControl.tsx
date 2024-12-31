import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AttendanceList } from "./AttendanceList";
import { AttendanceStats } from "./AttendanceStats";
import { Student } from "@/types/attendance";
import { useAuth } from "@/hooks/useAuth";
import { DailyObservations } from "./attendance/DailyObservations";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const AttendanceControl = () => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [attendanceDays, setAttendanceDays] = useState<Date[]>([]);
  const [showAttendanceList, setShowAttendanceList] = useState(false);
  const [observation, setObservation] = useState("");

  useEffect(() => {
    const loadStudents = () => {
      const allStudents = JSON.parse(localStorage.getItem("students") || "[]");
      const companyStudents = allStudents.filter((student: Student) => student.companyId === currentUser?.companyId);
      setStudents(companyStudents);
    };

    const loadAttendanceDays = () => {
      const allAttendanceDays = JSON.parse(localStorage.getItem("attendanceDays") || "[]");
      setAttendanceDays(allAttendanceDays);
    };

    loadStudents();
    loadAttendanceDays();
  }, [currentUser]);

  const handleStartAttendance = () => {
    if (date) {
      setShowAttendanceList(true);
      toast({
        title: "Chamada iniciada",
        description: `Chamada para ${format(date, 'dd/MM/yyyy')} iniciada.`,
      });
    }
  };

  const handleStatusChange = (studentId: string, status: Student["status"]) => {
    const updatedStudents = students.map(student => 
      student.id === studentId ? { ...student, status } : student
    );
    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    toast({
      title: "Status atualizado",
      description: "O status de presença foi atualizado com sucesso.",
    });
  };

  const handleObservationChange = (text: string) => {
    setObservation(text);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-800">Calendário</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-sm"
            locale={ptBR}
            modifiers={{
              highlighted: attendanceDays
            }}
            modifiersStyles={{
              highlighted: {
                backgroundColor: '#22c55e',
                color: 'white',
                borderRadius: '50%'
              }
            }}
          />
          <Button 
            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md transition-all duration-200 hover:shadow-lg"
            onClick={handleStartAttendance}
            disabled={!date || attendanceDays.some(d => 
              format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
            )}
          >
            Iniciar Chamada
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Estatísticas de Presença
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <AttendanceStats students={students} />
        </CardContent>
      </Card>

      {showAttendanceList && date && (
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800">
                Lista de Presença - {format(date, 'dd/MM/yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <AttendanceList
                students={students}
                onStatusChange={handleStatusChange}
                date={date}
              />
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800">
                Observações do Dia
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <DailyObservations 
                date={date}
                observation={observation}
                onObservationChange={handleObservationChange}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
