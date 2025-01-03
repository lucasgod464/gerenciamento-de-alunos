import { Room } from "@/types/room";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users, Clock, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthorizedUsersList } from "./AuthorizedUsersList";

interface RoomCardProps {
  room: Room;
  isSelected: boolean;
  companyId: string;
  onToggleSelection: (roomId: string) => void;
  getStudentsCount: (room: Room) => number;
}

export const RoomCard = ({
  room,
  isSelected,
  companyId,
  onToggleSelection,
  getStudentsCount,
}: RoomCardProps) => {
  const { toast } = useToast();

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
        <AuthorizedUsersList
          roomId={room.id}
          companyId={companyId}
          onRemoveAuthorization={handleRemoveAuthorization}
        />
        
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