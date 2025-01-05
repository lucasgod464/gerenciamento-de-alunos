import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AttendanceList } from "./AttendanceList";
import { AttendanceChart } from "./AttendanceChart";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/dateUtils";

interface Room {
  id: string;
  name: string;
}

export const AttendanceControl = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [hasAttendance, setHasAttendance] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRooms = async () => {
      if (!user?.companyId) return;
      
      const { data, error } = await supabase
        .from('rooms')
        .select('id, name')
        .eq('company_id', user.companyId)
        .eq('status', true);

      if (error) {
        console.error('Erro ao buscar salas:', error);
        return;
      }

      setRooms(data || []);
    };

    fetchRooms();
  }, [user?.companyId]);

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
      }
    };

    checkAttendance();
  }, [selectedDate, selectedRoom, user?.companyId]);

  const handleStartAttendance = async () => {
    if (!user?.companyId) return;

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Data</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Sala</h3>
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma sala" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full"
                onClick={handleStartAttendance}
                disabled={!selectedRoom || !selectedDate}
              >
                {isStarted ? "Cancelar Chamada" : "Iniciar Chamada"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <AttendanceChart 
              date={selectedDate} 
              companyId={user?.companyId || ''} 
              roomId={selectedRoom}
            />
          </CardContent>
        </Card>
      </div>

      {isStarted && (
        <AttendanceList
          date={selectedDate}
          roomId={selectedRoom}
          companyId={user?.companyId || ''}
          onAttendanceSaved={() => setHasAttendance(true)}
        />
      )}
    </div>
  );
};