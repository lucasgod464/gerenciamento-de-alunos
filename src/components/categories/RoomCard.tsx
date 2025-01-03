import { Room } from "@/types/room";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users, Clock, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { UserWithTags } from "./UserWithTags";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RoomCardProps {
  room: Room;
  isSelected: boolean;
  companyId: string;
  onToggleSelection: (roomId: string) => void;
  getStudentsCount: (room: Room) => number;
}

interface MainTeacher {
  id: string;
  name: string;
}

export const RoomCard = ({
  room,
  isSelected,
  companyId,
  onToggleSelection,
  getStudentsCount,
}: RoomCardProps) => {
  const [mainTeacher, setMainTeacher] = useState<MainTeacher | null>(null);

  useEffect(() => {
    const fetchMainTeacher = async () => {
      try {
        const { data: teacherData, error } = await supabase
          .from('room_authorized_users')
          .select(`
            user:user_id (
              id,
              name
            )
          `)
          .eq('room_id', room.id)
          .eq('is_main_teacher', true)
          .single();

        if (error) throw error;
        
        if (teacherData?.user) {
          setMainTeacher(teacherData.user as MainTeacher);
        }
      } catch (error) {
        console.error('Error fetching main teacher:', error);
      }
    };

    fetchMainTeacher();
  }, [room.id]);

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
            <span className="font-medium text-xs text-foreground/70">Professor Responsável</span>
          </div>
          <div className="pl-6 space-y-1">
            {mainTeacher ? (
              <UserWithTags 
                userName={mainTeacher.name} 
                companyId={companyId} 
              />
            ) : (
              <p className="text-sm">Nenhum professor responsável</p>
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