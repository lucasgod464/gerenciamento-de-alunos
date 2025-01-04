import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Room } from "@/types/room";
import { useToast } from "@/hooks/use-toast";

export function useUserRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserRooms = async () => {
      if (!user?.id) {
        console.log("No user ID found");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Iniciando busca de salas para o usuário:", user.id);
        
        // Primeiro, buscar os IDs das salas do usuário
        const { data: userRooms, error: userRoomsError } = await supabase
          .from('user_rooms')
          .select('room_id')
          .eq('user_id', user.id);

        if (userRoomsError) {
          console.error('Erro ao buscar user_rooms:', userRoomsError);
          throw userRoomsError;
        }

        if (!userRooms?.length) {
          console.log('Nenhuma sala encontrada para o usuário');
          setRooms([]);
          setIsLoading(false);
          return;
        }

        const roomIds = userRooms.map(ur => ur.room_id);
        console.log('IDs das salas para buscar:', roomIds);
        
        // Agora buscar os detalhes das salas
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
              student:students (
                id,
                name,
                birth_date,
                status,
                email,
                document,
                address,
                custom_fields,
                company_id,
                created_at
              )
            )
          `)
          .in('id', roomIds);

        if (roomsError) {
          console.error('Erro ao buscar salas:', roomsError);
          throw roomsError;
        }

        if (roomsData) {
          const transformedRooms: Room[] = roomsData.map(room => ({
            id: room.id,
            name: room.name,
            schedule: room.schedule,
            location: room.location,
            category: room.category,
            status: room.status,
            companyId: room.company_id,
            studyRoom: room.study_room,
            createdAt: room.created_at,
            students: room.room_students?.map(rs => ({
              id: rs.student.id,
              name: rs.student.name,
              birthDate: rs.student.birth_date,
              status: rs.student.status || false,
              email: rs.student.email || '',
              document: rs.student.document || '',
              address: rs.student.address || '',
              customFields: rs.student.custom_fields as Record<string, any>,
              companyId: rs.student.company_id,
              createdAt: rs.student.created_at
            })) || []
          }));
          
          console.log('Salas transformadas:', transformedRooms);
          setRooms(transformedRooms);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar as salas",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRooms();
  }, [user, toast]);

  return { rooms, isLoading };
}