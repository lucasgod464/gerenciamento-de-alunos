import { useEffect, useState } from "react";
import { Room } from "@/types/room";
import { CategoryColumn } from "./CategoryColumn";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Category } from "@/types/category";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Student, mapSupabaseStudentToStudent } from "@/types/student";

interface CategoriesKanbanProps {
  categories: Category[];
  companyId: string | null;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export const CategoriesKanban = ({ 
  categories, 
  companyId,
  onEditCategory,
  onDeleteCategory 
}: CategoriesKanbanProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!companyId) return;
    
    const fetchRooms = async () => {
      try {
        const { data: roomsData, error } = await supabase
          .from('rooms')
          .select(`
            *,
            room_students (
              student:student_id (
                *
              )
            )
          `)
          .eq('company_id', companyId);

        if (error) throw error;

        const transformedRooms: Room[] = roomsData.map(room => ({
          id: room.id,
          name: room.name,
          schedule: room.schedule,
          location: room.location,
          category: room.category,
          status: Boolean(room.status),
          companyId: room.company_id,
          studyRoom: room.study_room || '',
          authorizedUsers: [],
          students: room.room_students?.map(rs => 
            mapSupabaseStudentToStudent(rs.student, room.id, room.company_id)
          ) || [],
          created_at: room.created_at
        }));

        setRooms(transformedRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        toast({
          title: "Erro ao carregar salas",
          description: "Ocorreu um erro ao carregar as salas.",
          variant: "destructive",
        });
      }
    };

    fetchRooms();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('rooms-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms'
        },
        () => {
          fetchRooms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [companyId, toast]);

  const handleTransferRooms = async (roomIds: string[], targetCategoryId: string) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ category: targetCategoryId })
        .in('id', roomIds);

      if (error) throw error;

      setRooms(prevRooms => 
        prevRooms.map(room => {
          if (roomIds.includes(room.id)) {
            return { ...room, category: targetCategoryId };
          }
          return room;
        })
      );

      toast({
        title: "Salas transferidas",
        description: "As salas foram transferidas com sucesso.",
      });
    } catch (error) {
      console.error('Error transferring rooms:', error);
      toast({
        title: "Erro ao transferir salas",
        description: "Ocorreu um erro ao transferir as salas.",
        variant: "destructive",
      });
    }
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <div className="flex gap-6 p-4">
        {categories.map((category) => (
          <CategoryColumn
            key={category.id}
            category={category}
            categories={categories}
            rooms={rooms.filter((room) => room.category === category.id)}
            onEdit={() => onEditCategory(category)}
            onDelete={() => onDeleteCategory(category.id)}
            onTransferRooms={handleTransferRooms}
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};