import { Room } from "@/types/room";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Building2, Users, GraduationCap, Clock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserWithTags } from "./UserWithTags";

interface RoomCardProps {
  room: Room;
  selected: boolean;
  onSelect: () => void;
}

interface AuthorizedUser {
  id: string;
  name: string;
  email: string;
}

export const RoomCard = ({
  room,
  selected,
  onSelect
}: RoomCardProps) => {
  const [authorizedUsers, setAuthorizedUsers] = useState<AuthorizedUser[]>([]);
  const [categoryColor, setCategoryColor] = useState<string>("#6b21a8"); // cor roxa padrão

  useEffect(() => {
    const fetchAuthorizedUsers = async () => {
      try {
        const { data: userData, error } = await supabase
          .from('user_rooms')
          .select(`
            user_id,
            emails:user_id (
              id,
              name,
              email
            )
          `)
          .eq('room_id', room.id);

        if (error) throw error;

        if (userData) {
          const users = userData.map(ur => ({
            id: ur.emails.id,
            name: ur.emails.name,
            email: ur.emails.email
          }));
          setAuthorizedUsers(users);
        }
      } catch (error) {
        console.error('Erro ao carregar usuários vinculados:', error);
      }
    };

    const fetchCategoryColor = async () => {
      try {
        const { data: categoryData, error } = await supabase
          .from('categories')
          .select('color')
          .eq('id', room.category)
          .single();

        if (error) throw error;

        if (categoryData && categoryData.color) {
          setCategoryColor(categoryData.color);
        }
      } catch (error) {
        console.error('Erro ao carregar cor da categoria:', error);
      }
    };

    fetchAuthorizedUsers();
    fetchCategoryColor();
  }, [room.id, room.category]);

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 bg-white",
        selected ? "ring-2 ring-primary ring-offset-2" : "hover:shadow-md"
      )}
      onClick={onSelect}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4" style={{ color: categoryColor }} />
          <h4 className="font-medium text-sm">{room.name}</h4>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" style={{ color: categoryColor }} />
            <span className="text-sm text-muted-foreground">
              Usuários Vinculados ({authorizedUsers.length})
            </span>
          </div>
          <div className="pl-6 space-y-1">
            {authorizedUsers.length > 0 ? (
              authorizedUsers.map((user) => (
                <UserWithTags
                  key={user.id}
                  userName={user.name}
                  companyId={room.companyId || ""}
                />
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                Nenhum usuário vinculado
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" style={{ color: categoryColor }} />
          <span className="text-sm text-muted-foreground">
            {room.students?.length || 0} alunos
          </span>
        </div>

        {room.schedule && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" style={{ color: categoryColor }} />
            <span className="text-sm text-muted-foreground">{room.schedule}</span>
          </div>
        )}

        {room.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" style={{ color: categoryColor }} />
            <span className="text-sm text-muted-foreground">{room.location}</span>
          </div>
        )}
      </div>
    </Card>
  );
};