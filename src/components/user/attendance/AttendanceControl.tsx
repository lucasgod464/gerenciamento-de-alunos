import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { AttendanceHeader } from "./AttendanceHeader";
import { AttendanceList } from "./AttendanceList";
import { useAttendanceData } from "./hooks/useAttendanceData";
import { StudentDetailsDialog } from "../student/StudentDetailsDialog";
import { Search, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AttendanceControl() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedRoom, setSelectedRoom] = useState("");
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [isAttendanceStarted, setIsAttendanceStarted] = useState(false);
  const { toast } = useToast();
  
  const {
    students,
    isLoading,
    handleStatusChange,
    handleSaveAttendance,
    handleCancelAttendance,
  } = useAttendanceData(selectedDate, selectedRoom);

  const handleStartAttendance = () => {
    if (!selectedRoom) {
      toast({
        title: "Selecione uma sala",
        description: "É necessário selecionar uma sala para iniciar a chamada",
        variant: "destructive",
      });
      return;
    }
    setIsAttendanceStarted(true);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <AttendanceHeader
          selectedRoom={selectedRoom}
          onRoomChange={setSelectedRoom}
          onStartAttendance={handleStartAttendance}
          isAttendanceStarted={isAttendanceStarted}
        />
        <Button
          variant="outline"
          onClick={() => setShowDetailsDialog(true)}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Consultar Aluno
        </Button>
      </div>

      <div className="grid md:grid-cols-[300px,1fr] gap-6">
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="border rounded-md"
          />
        </Card>

        <Card className="p-4">
          {isAttendanceStarted ? (
            <>
              <AttendanceList
                students={students}
                onStatusChange={handleStatusChange}
              />
              
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleCancelAttendance();
                    setIsAttendanceStarted(false);
                  }}
                >
                  Cancelar Chamada
                </Button>
                <Button
                  onClick={() => {
                    handleSaveAttendance();
                    setIsAttendanceStarted(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Salvar Chamada
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              Selecione uma sala e inicie a chamada para visualizar a lista de alunos
            </div>
          )}
        </Card>
      </div>

      <StudentDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />
    </div>
  );
}