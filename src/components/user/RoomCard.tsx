import { Room } from "@/types/room";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DoorOpen, Users, Calendar, MapPin, Tag } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const [categoryName, setCategoryName] = useState("");
  const [studentsCount, setStudentsCount] = useState(0);

  useEffect(() => {
    const fetchCategory = async () => {
      if (room.category) {
        const { data, error } = await supabase
          .from('categories')
          .select('name')
          .eq('id', room.category)
          .single();

        if (!error && data) {
          setCategoryName(data.name);
        }
      }
    };

    const fetchStudentsCount = async () => {
      const { count, error } = await supabase
        .from('room_students')
        .select('*', { count: 'exact' })
        .eq('room_id', room.id);

      if (!error && count !== null) {
        setStudentsCount(count);
      }
    };

    fetchCategory();
    fetchStudentsCount();
  }, [room.category, room.id]);

  return (
    <Card key={room.id} className="overflow-hidden">
      <CardHeader className="bg-purple-50 dark:bg-purple-900/10">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/20">
            <DoorOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{room.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm">
              {studentsCount} alunos matriculados
            </span>
          </div>

          {categoryName && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm">{categoryName}</span>
            </div>
          )}

          {room.schedule && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm">{room.schedule}</span>
            </div>
          )}

          {room.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm">{room.location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}