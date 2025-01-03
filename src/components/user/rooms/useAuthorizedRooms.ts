import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Room } from "@/types/room";

interface Category {
  id: string;
  name: string;
}

export function useAuthorizedRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRoomsAndCategories = async () => {
      if (!user?.id || !user?.companyId) {
        console.log("No user ID or companyId found");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching rooms for user:", user.id);
        
        // First fetch the authorized room IDs for the user
        const { data: authorizedRooms, error: authError } = await supabase
          .from('user_authorized_rooms')
          .select('room_id')
          .eq('user_id', user.id);

        if (authError) throw authError;

        if (!authorizedRooms?.length) {
          console.log("No authorized rooms found");
          setRooms([]);
          setIsLoading(false);
          return;
        }

        const roomIds = authorizedRooms.map(ar => ar.room_id);
        console.log("Found authorized room IDs:", roomIds);

        // Then fetch the full room details
        const { data: roomsData, error: roomsError } = await supabase
          .from('rooms')
          .select(`
            *,
            room_students (
              student:student_id (
                id,
                name
              )
            )
          `)
          .in('id', roomIds)
          .eq('status', true);

        if (roomsError) throw roomsError;

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name')
          .eq('company_id', user.companyId);

        if (categoriesError) throw categoriesError;

        // Transform rooms data
        const transformedRooms = roomsData?.map(room => ({
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
        })) || [];

        console.log("Transformed rooms:", transformedRooms);
        setRooms(transformedRooms);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar as salas",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomsAndCategories();
  }, [user, toast]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Sem categoria";
  };

  const getStudentCount = (room: Room) => {
    return room.students?.length || 0;
  };

  return {
    rooms,
    isLoading,
    getCategoryName,
    getStudentCount
  };
}