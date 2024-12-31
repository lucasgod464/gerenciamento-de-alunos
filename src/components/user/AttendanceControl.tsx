import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AttendanceStats } from "./AttendanceStats";
import { AttendanceList } from "./AttendanceList";
import { Student, DailyAttendance, DailyObservation } from "@/types/attendance";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const AttendanceControl = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dailyAttendances, setDailyAttendances] = useState<DailyAttendance[]>([]);
  const [observation, setObservation] = useState("");
  const [observations, setObservations] = useState<DailyObservation[]>([]);
  const [attendanceDays, setAttendanceDays] = useState<Date[]>([]);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  // Load students from localStorage filtered by company
  const getCompanyStudents = () => {
    if (!currentUser?.companyId) return [];
    const savedStudents = localStorage.getItem("students");
    if (!savedStudents) return [];
    
    const allStudents = JSON.parse(savedStudents);
    return allStudents.filter((student: Student) => 
      student.companyId === currentUser.companyId
    );
  };

  useEffect(() => {
    // Carregar dias com chamada do localStorage
    const savedAttendanceDays = localStorage.getItem(`attendanceDays_${currentUser?.companyId}`);
    if (savedAttendanceDays) {
      setAttendanceDays(JSON.parse(savedAttendanceDays).map((date: string) => new Date(date)));
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const existingAttendance = dailyAttendances.find(da => da.date === dateStr);
      
      if (!existingAttendance) {
        setDailyAttendances(prev => [...prev, {
          date: dateStr,
          students: getCompanyStudents()
        }]);
      }

      const existingObservation = observations.find(obs => obs.date === dateStr);
      setObservation(existingObservation?.text || "");
    }
  }, [selectedDate, currentUser]);

  const getCurrentDayStudents = () => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.toISOString().split('T')[0];
    const attendance = dailyAttendances.find(da => da.date === dateStr);
    return attendance?.students || [];
  };

  const handleStatusChange = (studentId: string, status: Student["status"]) => {
    if (!selectedDate) return;
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    setDailyAttendances(prevAttendances => {
      const updatedAttendances = prevAttendances.map(da => {
        if (da.date === dateStr) {
          return {
            ...da,
            students: da.students.map(student =>
              student.id === studentId ? { ...student, status } : student
            )
          };
        }
        return da;
      });

      if (!prevAttendances.some(da => da.date === dateStr)) {
        updatedAttendances.push({
          date: dateStr,
          students: getCompanyStudents().map(student =>
            student.id === studentId ? { ...student, status } : student
          )
        });
      }

      return updatedAttendances;
    });
  };

  const handleObservationChange = (text: string) => {
    if (text.length <= 100 && selectedDate) {
      setObservation(text);
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      setObservations(prev => {
        const filtered = prev.filter(obs => obs.date !== dateStr);
        return [...filtered, { date: dateStr, text }];
      });
    }
  };

  const startAttendance = () => {
    if (!selectedDate || !currentUser?.companyId) return;

    const newAttendanceDays = [...attendanceDays, selectedDate];
    setAttendanceDays(newAttendanceDays);
    
    // Salvar no localStorage
    localStorage.setItem(
      `attendanceDays_${currentUser.companyId}`, 
      JSON.stringify(newAttendanceDays.map(date => date.toISOString()))
    );

    toast({
      title: "Chamada iniciada",
      description: "A chamada foi iniciada para o dia selecionado.",
    });
  };

  const isAttendanceDay = (date: Date) => {
    return attendanceDays.some(attendanceDate => 
      attendanceDate.toISOString().split('T')[0] === date.toISOString().split('T')[0]
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                attendance: attendanceDays
              }}
              modifiersStyles={{
                attendance: {
                  backgroundColor: "#22c55e",
                  color: "white",
                  borderRadius: "50%"
                }
              }}
            />
            <Button 
              onClick={startAttendance}
              disabled={!selectedDate || isAttendanceDay(selectedDate)}
              className="w-full"
            >
              Iniciar Chamada
            </Button>
          </CardContent>
        </Card>

        <AttendanceStats students={getCurrentDayStudents()} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Presença - {selectedDate?.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isAttendanceDay(selectedDate || new Date()) ? (
              <>
                <AttendanceList
                  students={getCurrentDayStudents()}
                  onStatusChange={handleStatusChange}
                  date={selectedDate || new Date()}
                />

                <div className="space-y-2">
                  <CardTitle className="text-lg">Observações do dia</CardTitle>
                  <Textarea
                    value={observation}
                    onChange={(e) => handleObservationChange(e.target.value)}
                    placeholder="Digite suas observações para este dia (máximo 100 caracteres)"
                    maxLength={100}
                    className="min-h-[100px]"
                  />
                  <p className="text-sm text-muted-foreground text-right">
                    {observation.length}/100 caracteres
                  </p>
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Clique em "Iniciar Chamada" para começar a registrar as presenças deste dia.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};