import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DoorOpen, Users, Calendar, MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Room } from "@/types/room";

export function UserRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserRooms = async () => {
      if (!user?.id) {
        console.log("No user ID found");
        return;
      }

      try {
        // Buscar todas as salas em uma única query
        const { data: roomsData, error: roomsError } = await supabase
          .from('rooms')
          .select(`
            id,
            name,
            schedule,
            location,
            category,
            status,
            company_id,
            study_room,
            created_at,
            room_students (
              student:students (*)
            )
          `);

        if (roomsError) {
          console.error('Error fetching rooms:', roomsError);
          throw roomsError;
        }

        if (roomsData) {
          const transformedRooms = roomsData.map(room => ({
            id: room.id,
            name: room.name,
            schedule: room.schedule,
            location: room.location,
            category: room.category,
            status: room.status,
            companyId: room.company_id,
            studyRoom: room.study_room,
            createdAt: room.created_at,
            students: room.room_students?.map(rs => rs.student) || []
          }));
          
          console.log('Salas carregadas:', transformedRooms);
          setRooms(transformedRooms);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar as salas",
          variant: "destructive",
        });
      }
    };

    fetchUserRooms();
  }, [user, toast]);

  const getStudentCount = (room: Room) => {
    return room.students?.length || 0;
  };

  const getCapacityPercentage = (room: Room) => {
    const studentCount = getStudentCount(room);
    const estimatedCapacity = 30;
    return Math.min((studentCount / estimatedCapacity) * 100, 100);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Carregando...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (rooms.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Você ainda não tem acesso a nenhuma sala.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <Card key={room.id} className="overflow-hidden">
          <CardHeader className="bg-purple-50 dark:bg-purple-900/10">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/20">
                <DoorOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">{room.name}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      {getStudentCount(room)} alunos
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Capacidade estimada: 30
                    </span>
                  </div>
                  <Progress 
                    value={getCapacityPercentage(room)} 
                    className="h-2"
                  />
                </div>
              </div>

              {room.schedule && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm">{room.schedule}</span>
                </div>
              )}

              {room.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm">{room.location}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}