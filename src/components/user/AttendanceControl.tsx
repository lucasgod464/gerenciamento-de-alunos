import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AttendanceStats } from "./AttendanceStats";
import { AttendanceList } from "./AttendanceList";
import { Student, DailyAttendance, DailyObservation } from "@/types/attendance";
import { useAuth } from "@/hooks/useAuth";

export const AttendanceControl = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dailyAttendances, setDailyAttendances] = useState<DailyAttendance[]>([]);
  const [observation, setObservation] = useState("");
  const [observations, setObservations] = useState<DailyObservation[]>([]);
  const { user: currentUser } = useAuth();
  
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

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
