import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { UserTags } from "./table/UserTags";
import { UserActions } from "./table/UserActions";
import { supabase } from "@/integrations/supabase/client";

interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onViewDetails: (user: User) => void;
}

export const UserTableRow = ({ user, onEdit, onDelete, onViewDetails }: UserTableRowProps) => {
  const [authorizedRooms, setAuthorizedRooms] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserRooms = async () => {
      try {
        const { data: userRooms, error: userRoomsError } = await supabase
          .from('user_rooms')
          .select('room_id')
          .eq('user_id', user.id);

        if (userRoomsError) throw userRoomsError;

        if (userRooms) {
          const roomIds = userRooms.map(ur => ur.room_id);
          const { data: rooms, error: roomsError } = await supabase
            .from('rooms')
            .select('name')
            .in('id', roomIds);

          if (roomsError) throw roomsError;
          
          if (rooms) {
            setAuthorizedRooms(rooms.map(room => room.name));
          }
        }
      } catch (error) {
        console.error('Error fetching user rooms:', error);
      }
    };

    fetchUserRooms();
  }, [user.id]);

  return (
    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      <td className="p-4">
        <div className="font-medium">{user.name}</div>
        <div className="text-sm text-muted-foreground">{user.email}</div>
      </td>
      <td className="p-4">
        <Badge variant={user.accessLevel === "Admin" ? "default" : "secondary"}>
          {user.accessLevel}
        </Badge>
      </td>
      <td className="p-4">
        <div className="flex flex-wrap gap-1">
          {authorizedRooms.map((room, index) => (
            <Badge key={index} variant="outline">
              {room}
            </Badge>
          ))}
        </div>
      </td>
      <td className="p-4">
        <UserTags userId={user.id} />
      </td>
      <td className="p-4">
        {user.lastAccess && (
          <span className="text-sm text-muted-foreground">
            {format(new Date(user.lastAccess), "dd/MM/yyyy HH:mm")}
          </span>
        )}
      </td>
      <td className="p-4">
        <Badge variant={user.status ? "success" : "secondary"}>
          {user.status ? "Ativo" : "Inativo"}
        </Badge>
      </td>
      <td className="p-4">
        <UserActions
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
        />
      </td>
    </tr>
  );
};