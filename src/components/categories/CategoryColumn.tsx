import { Room } from "@/types/room";
import { Category } from "@/types/category";
import { RoomCard } from "./RoomCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface CategoryColumnProps {
  category: Category;
  rooms: Room[];
}

export function CategoryColumn({ category, rooms }: CategoryColumnProps) {
  const { user: currentUser } = useAuth();

  const getAuthorizedUserNames = async (room: Room): Promise<string> => {
    if (!currentUser?.companyId) return "Nenhum usuário vinculado";

    try {
      const { data: authorizedUsers, error } = await supabase
        .from('room_authorized_users')
        .select('users (name)')
        .eq('room_id', room.id);

      if (error) throw error;

      if (!authorizedUsers || authorizedUsers.length === 0) {
        return "Nenhum usuário vinculado";
      }

      return authorizedUsers
        .map(auth => auth.users?.name)
        .filter(Boolean)
        .join(", ");
    } catch (error) {
      console.error("Erro ao buscar usuários autorizados:", error);
      return "Erro ao carregar usuários";
    }
  };

  const categoryRooms = rooms.filter(room => room.category === category.id);

  return (
    <div className="flex flex-col gap-4">
      <div 
        className="flex items-center gap-2 p-2 rounded-lg"
        style={{ backgroundColor: category.color + '20' }}
      >
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: category.color }} 
        />
        <span className="font-medium">{category.name}</span>
        <span className="text-sm text-muted-foreground ml-auto">
          {categoryRooms.length} sala(s)
        </span>
      </div>
      <div className="space-y-4">
        {categoryRooms.map((room) => (
          <RoomCard 
            key={room.id} 
            room={room}
            getAuthorizedUserNames={getAuthorizedUserNames}
          />
        ))}
      </div>
    </div>
  );
}