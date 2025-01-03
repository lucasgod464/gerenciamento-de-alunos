import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
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
  room_students?: Array<{
    student: {
      id: string;
      name: string;
    };
  }>;
}

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
        const [roomsResponse, categoriesResponse] = await Promise.all([
          supabase
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
            .eq('user_id', user.id),
          
          supabase
            .from('categories')
            .select('id, name')
            .eq('company_id', user.companyId)
        ]);

        if (roomsResponse.error) throw roomsResponse.error;
        if (categoriesResponse.error) throw categoriesResponse.error;

        const transformedRooms = roomsResponse.data
          ?.filter(ar => ar.room && ar.room.status)
          .map(ar => ({
            ...ar.room,
            room_students: ar.room.room_students || []
          })) || [];

        setRooms(transformedRooms);
        setCategories(categoriesResponse.data || []);
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
    return room.room_students?.filter(student => typeof student === 'object').length || 0;
  };

  return {
    rooms,
    isLoading,
    getCategoryName,
    getStudentCount
  };
}