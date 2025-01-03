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
        // Fetch authorized rooms
        const { data: authorizedRoomsData, error: authorizedRoomsError } = await supabase
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

        if (authorizedRoomsError) throw authorizedRoomsError;

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name')
          .eq('company_id', user.companyId);

        if (categoriesError) throw categoriesError;

        // Transform rooms data
        const transformedRooms = authorizedRoomsData
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
            students: ar.room.room_students?.map(rs => rs.student) || []
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