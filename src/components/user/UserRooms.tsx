import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DoorOpen, Users, Calendar, MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Room {
  id: string;
  name: string;
  schedule: string;
  location: string;
  category: string;
  status: boolean;
  companyId: string | null;
  studyRoom: string;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
}

export function UserRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRoomsAndCategories = async () => {
      if (!user?.id || !user?.companyId) {
        console.log("No user ID or companyId found");
        return;
      }

      try {
        // Fetch authorized rooms for the user
        const { data: authorizedRooms, error: roomsError } = await supabase
          .from('user_authorized_rooms')
          .select(`
            room:room_id (
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
                student:student_id (
                  id,
                  name
                )
              )
            )
          `)
          .eq('user_id', user.id);

        if (roomsError) throw roomsError;

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name')
          .eq('company_id', user.companyId);

        if (categoriesError) throw categoriesError;

        // Transform the rooms data
        const transformedRooms = authorizedRooms
          ?.filter(ar => ar.room && ar.room.status)
          .map(ar => ({
            id: ar.room.id,
            name: ar.room.name,
            schedule: ar.room.schedule,
            location: ar.room.location,
            category: ar.room.category,
            status: ar.room.status,
            companyId: ar.room.company_id,
            studyRoom: ar.room.study_room,
            createdAt: ar.room.created_at,
            students: ar.room.room_students || []
          })) || [];

        setRooms(transformedRooms);
        setCategories(categoriesData || []);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar as salas",
          variant: "destructive",
        });
      }
    };

    fetchRoomsAndCategories();
  }, [user, toast]);

  const getStudentCount = (room: Room) => {
    return room.students?.filter(student => typeof student === 'object').length || 0;
  };

  const getCapacityPercentage = (room: Room) => {
    const studentCount = getStudentCount(room);
    const estimatedCapacity = 30; // You might want to make this dynamic based on room settings
    return Math.min((studentCount / estimatedCapacity) * 100, 100);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Sem categoria";
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
                {room.category && (
                  <p className="text-sm text-muted-foreground">
                    Categoria: {getCategoryName(room.category)}
                  </p>
                )}
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