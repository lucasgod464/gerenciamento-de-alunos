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
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching rooms for user:", user.id);

        const { data, error } = await supabase
          .from("user_rooms")
          .select(`
            room_id,
            rooms (
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
            )
          `)
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching user rooms:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar as salas.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const transformedRooms = data?.map((item) => ({
          id: item.rooms.id,
          name: item.rooms.name,
          schedule: item.rooms.schedule,
          location: item.rooms.location,
          category: item.rooms.category,
          status: item.rooms.status,
          companyId: item.rooms.company_id,
          studyRoom: item.rooms.study_room,
          createdAt: item.rooms.created_at,
          students: item.rooms.room_students?.map((rs) => rs.student)
            ?.map(mapSupabaseStudent) || [],
        })) || [];

        setRooms(transformedRooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as salas.",
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

const mapSupabaseStudent = (data: any): any => ({
  id: data.id,
  name: data.name,
  birthDate: data.birth_date,
  status: data.status,
  email: data.email,
  document: data.document,
  address: data.address,
  customFields: typeof data.custom_fields === 'string' ? JSON.parse(data.custom_fields) : data.custom_fields || {},
  companyId: data.company_id,
  createdAt: data.created_at
});
