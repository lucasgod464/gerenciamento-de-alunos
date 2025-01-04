import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceStats } from "./AttendanceStats";
import { AttendanceList } from "./AttendanceList";
import { Student, DailyAttendance, DailyObservation } from "@/types/attendance";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { AttendanceCalendar } from "./attendance/AttendanceCalendar";
import { DailyObservations } from "./attendance/DailyObservations";

export const AttendanceControl = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dailyAttendances, setDailyAttendances] = useState<DailyAttendance[]>([]);
  const [observation, setObservation] = useState("");
  const [observations, setObservations] = useState<DailyObservation[]>([]);
  const [attendanceDays, setAttendanceDays] = useState<Date[]>([]);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  const getCompanyStudents = () => {
    if (!currentUser?.companyId) return [];
    
    // Carregar todas as salas da empresa
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const companyRooms = allRooms.filter((room: any) => 
      room.companyId === currentUser.companyId
    );
    
    // Coletar todos os alunos de todas as salas
    let allStudents: Student[] = [];
    companyRooms.forEach((room: any) => {
      if (room.students && Array.isArray(room.students)) {
        const roomStudents = room.students.map((student: Student) => ({
          ...student,
          room: room.id
        }));
        allStudents = [...allStudents, ...roomStudents];
      }
    });
    
    return allStudents;
  };

  useEffect(() => {
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
        const students = getCompanyStudents();
        console.log('Loaded students:', students); // Debug log
        
        setDailyAttendances(prev => [...prev, {
          date: dateStr,
          students: students
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
    
    localStorage.setItem(
      `attendanceDays_${currentUser.companyId}`, 
      JSON.stringify(newAttendanceDays.map(date => date.toISOString()))
    );

    toast({
      title: "Chamada iniciada",
      description: "A chamada foi iniciada para o dia selecionado.",
    });
  };

  const cancelAttendance = () => {
    if (!selectedDate || !currentUser?.companyId) return;

    // Remove o dia selecionado da lista de dias com chamada
    const newAttendanceDays = attendanceDays.filter(date => 
      date.toISOString().split('T')[0] !== selectedDate.toISOString().split('T')[0]
    );
    setAttendanceDays(newAttendanceDays);

    // Remove os dados de presença daquele dia
    const dateStr = selectedDate.toISOString().split('T')[0];
    setDailyAttendances(prevAttendances => 
      prevAttendances.filter(attendance => attendance.date !== dateStr)
    );

    // Remove as observações daquele dia
    setObservations(prevObservations => 
      prevObservations.filter(obs => obs.date !== dateStr)
    );
    
    // Atualiza o localStorage
    localStorage.setItem(
      `attendanceDays_${currentUser.companyId}`, 
      JSON.stringify(newAttendanceDays.map(date => date.toISOString()))
    );

    toast({
      title: "Chamada cancelada",
      description: "A chamada foi cancelada para o dia selecionado.",
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
        <AttendanceCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          attendanceDays={attendanceDays}
          onStartAttendance={startAttendance}
          isAttendanceDay={isAttendanceDay}
          onCancelAttendance={cancelAttendance}
        />
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
                <DailyObservations
                  observation={observation}
                  onObservationChange={handleObservationChange}
                />
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