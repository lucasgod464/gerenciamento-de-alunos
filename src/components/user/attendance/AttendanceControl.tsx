import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AttendanceList } from "./AttendanceList";
import { AttendanceHeader } from "./AttendanceHeader";
import { useAttendanceData } from "./hooks/useAttendanceData";
import { formatDate } from "@/utils/dateUtils";
import { useToast } from "@/hooks/use-toast";
import { StudentDetailsDialog } from "../student/StudentDetailsDialog";
import { User } from "lucide-react";

export function AttendanceControl() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedRoom, setSelectedRoom] = useState("");
  const { students, setStudents } = useAttendanceData(date, selectedRoom);
  const { toast } = useToast();
  const [showStudentDetails, setShowStudentDetails] = useState(false);

  const handleStatusChange = (studentId: string, newStatus: string) => {
    setStudents(
      students.map((student) =>
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    );
  };

  const handleSave = async () => {
    try {
      const formattedDate = formatDate(date);
      const attendancePromises = students.map(async (student) => {
        if (!student.status) return;
        const attendance = {
          date: formattedDate,
          studentId: student.id,
          status: student.status,
          roomId: selectedRoom,
        };
        // Save attendance logic here
      });

      await Promise.all(attendancePromises);

      toast({
        title: "Sucesso",
        description: "Chamada salva com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao salvar chamada:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar a chamada",
        variant: "destructive",
      });
    }
  };

  const handleCancel = async () => {
    try {
      const formattedDate = formatDate(date);
      // Cancel attendance logic here
      toast({
        title: "Sucesso",
        description: "Chamada cancelada com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao cancelar chamada:", error);
      toast({
        title: "Erro",
        description: "Erro ao cancelar a chamada",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Controle de Presença</h2>
        <Button
          variant="outline"
          onClick={() => setShowStudentDetails(true)}
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          Consultar Aluno
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <AttendanceHeader
            selectedRoom={selectedRoom}
            onRoomChange={setSelectedRoom}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-md border"
              />
            </div>

            <AttendanceList
              students={students}
              onStatusChange={handleStatusChange}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar Chamada
            </Button>
            <Button onClick={handleSave}>Salvar Chamada</Button>
          </div>
        </div>
      </Card>

      <StudentDetailsDialog
        open={showStudentDetails}
        onClose={() => setShowStudentDetails(false)}
      />
    </div>
  );
}