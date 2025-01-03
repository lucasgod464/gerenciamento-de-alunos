import { Room } from "@/types/room";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users, Clock, MapPin, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { UserWithTags } from "./UserWithTags";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface RoomCardProps {
  room: Room;
  isSelected: boolean;
  companyId: string;
  onToggleSelection: (roomId: string) => void;
  getStudentsCount: (room: Room) => number;
}

interface AuthorizedUser {
  id: string;
  name: string;
  email: string;
  is_main_teacher?: boolean;
}

export const RoomCard = ({
  room,
  isSelected,
  companyId,
  onToggleSelection,
  getStudentsCount,
}: RoomCardProps) => {
  const [authorizedUsers, setAuthorizedUsers] = useState<AuthorizedUser[]>([]);
  const { toast } = useToast();

  const fetchAuthorizedUsers = async () => {
    try {
      console.log('Fetching authorized users for room:', room.id);
      
      const { data: authorizedData, error: authorizedError } = await supabase
        .from('room_authorized_users')
        .select(`
          user_id,
          is_main_teacher,
          users (
            id,
            name,
            email
          )
        `)
        .eq('room_id', room.id);

      if (authorizedError) {
        console.error('Error details:', authorizedError);
        throw authorizedError;
      }

      console.log('Authorized users data:', authorizedData);

      if (authorizedData) {
        const users = authorizedData
          .filter(item => item.users) // Filter out any null users
          .map(item => ({
            id: item.users.id,
            name: item.users.name,
            email: item.users.email,
            is_main_teacher: item.is_main_teacher
          }));
        console.log('Processed users:', users);
        setAuthorizedUsers(users);
      }
    } catch (error) {
      console.error('Error fetching authorized users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar os usuários vinculados.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAuthorizedUsers();
  }, [room.id]);

  const handleRemoveAuthorization = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('room_authorized_users')
        .delete()
        .eq('room_id', room.id)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Autorização removida",
        description: "O usuário foi desvinculado da sala com sucesso.",
      });

      fetchAuthorizedUsers();
    } catch (error) {
      console.error('Error removing authorization:', error);
      toast({
        title: "Erro ao remover autorização",
        description: "Ocorreu um erro ao desvincular o usuário da sala.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card 
      className={`bg-white/90 backdrop-blur-sm hover:bg-white/95 transition-colors cursor-pointer ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => onToggleSelection(room.id)}
    >
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <School className="h-4 w-4" />
          {room.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm text-muted-foreground space-y-4">
        <div>
          <div className="flex items-center gap-2 text-sm mb-1">
            <Users className="h-4 w-4" />
            <span className="font-medium text-xs text-foreground/70">Usuários Vinculados</span>
          </div>
          <div className="pl-6 space-y-1">
            {authorizedUsers.length > 0 ? (
              authorizedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <UserWithTags 
                      userName={user.name} 
                      companyId={companyId} 
                    />
                    {user.is_main_teacher && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        Professor Responsável
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAuthorization(user.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm">Nenhum usuário vinculado</p>
            )}
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="space-y-2">
          <div>
            <div className="flex items-center gap-2 text-sm mb-1">
              <Users className="h-4 w-4" />
              <span className="font-medium text-xs text-foreground/70">Total de Alunos</span>
            </div>
            <div className="pl-6 text-left">
              <span className="text-sm">{getStudentsCount(room)} alunos</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm mb-1">
              <Clock className="h-4 w-4" />
              <span className="font-medium text-xs text-foreground/70">Horário</span>
            </div>
            <div className="pl-6 text-left">
              <span className="text-sm">{room.schedule}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm mb-1">
              <MapPin className="h-4 w-4" />
              <span className="font-medium text-xs text-foreground/70">Local</span>
            </div>
            <div className="pl-6 text-left">
              <span className="text-sm">{room.location}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};