import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AttendanceList } from "./AttendanceList";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/dateUtils";
import { CalendarRange, School2 } from "lucide-react";

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

  // Busca as salas disponíveis
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
        toast({
          title: "Erro ao carregar salas",
          description: "Não foi possível carregar a lista de salas.",
          variant: "destructive",
        });
        return;
      }

      setRooms(data || []);
    };

    fetchRooms();
  }, [user?.companyId, toast]);

  // Verifica se já existe chamada para a data e sala selecionadas
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CalendarRange className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium text-gray-700">Selecione a Data</h3>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border bg-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <School2 className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium text-gray-700">Selecione a Sala</h3>
              </div>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="bg-white">
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
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleStartAttendance}
                disabled={!selectedRoom || !selectedDate}
              >
                {isStarted ? "Cancelar Chamada" : "Iniciar Chamada"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {isStarted && (
        <div className="animate-fade-in">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <AttendanceList
                date={selectedDate}
                roomId={selectedRoom}
                companyId={user?.companyId || ''}
                onAttendanceSaved={() => setHasAttendance(true)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};