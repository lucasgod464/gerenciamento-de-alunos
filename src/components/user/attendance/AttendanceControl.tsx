import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AttendanceList } from "./AttendanceList";
import { formatDate } from "@/utils/dateUtils";
import { StudentDetailsDialog } from "../student/StudentDetailsDialog";
import { useUserRooms } from "@/hooks/useUserRooms";

export const AttendanceControl = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const { rooms, isLoading } = useUserRooms();
  const [isStarted, setIsStarted] = useState(false);
  const [hasAttendance, setHasAttendance] = useState(false);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkAttendance = async () => {
      if (!user?.companyId || !selectedDate || !selectedRoom) return;

      const formattedDate = formatDate(selectedDate);
      
      try {
        const { data, error } = await supabase
          .from('daily_attendance')
          .select('id')
          .eq('date', formattedDate)
          .eq('company_id', user.companyId)
          .eq('room_id', selectedRoom);

        if (error) throw error;

        const hasData = data && data.length > 0;
        setHasAttendance(hasData);
        setIsStarted(hasData);
      } catch (error) {
        console.error('Erro ao verificar chamada:', error);
        toast({
          title: "Erro ao verificar chamada",
          description: "Não foi possível verificar se já existe chamada para esta data.",
          variant: "destructive",
        });
      }
    };

    checkAttendance();
  }, [selectedDate, selectedRoom, user?.companyId, toast]);

  const handleStartAttendance = async () => {
    if (!user?.companyId || !selectedRoom) return;

    if (isStarted) {
      try {
        const formattedDate = formatDate(selectedDate);
        
        const { error } = await supabase
          .from('daily_attendance')
          .delete()
          .eq('date', formattedDate)
          .eq('company_id', user.companyId)
          .eq('room_id', selectedRoom);

        if (error) throw error;

        setIsStarted(false);
        setHasAttendance(false);
        
        toast({
          title: "Chamada cancelada",
          description: "A chamada foi cancelada com sucesso.",
        });
      } catch (error) {
        console.error('Erro ao cancelar chamada:', error);
        toast({
          title: "Erro ao cancelar chamada",
          description: "Não foi possível cancelar a chamada.",
          variant: "destructive",
        });
      }
    } else {
      setIsStarted(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-center text-muted-foreground">
          Carregando...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 mb-2">Data</h3>
              <div className="flex justify-center bg-white rounded-lg border p-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md"
                  disabled={isStarted}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Sala</h3>
                <Select value={selectedRoom} onValueChange={setSelectedRoom} disabled={isStarted}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Selecione uma sala" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.length > 0 ? rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name}
                      </SelectItem>
                    )) : (
                      <SelectItem value="" disabled>
                        Nenhuma sala disponível
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-medium"
                  onClick={handleStartAttendance}
                  disabled={!selectedRoom || !selectedDate}
                  size="lg"
                >
                  {isStarted ? "Cancelar Chamada" : "Iniciar Chamada"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full py-6 text-lg"
                  onClick={() => setShowStudentDetails(true)}
                  size="lg"
                >
                  Consultar Aluno Individual
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isStarted && (
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <AttendanceList
              date={selectedDate}
              roomId={selectedRoom}
              companyId={user?.companyId || ''}
              onAttendanceSaved={() => setHasAttendance(true)}
            />
          </CardContent>
        </Card>
      )}

      <StudentDetailsDialog
        open={showStudentDetails}
        onClose={() => setShowStudentDetails(false)}
      />
    </div>
  );
};