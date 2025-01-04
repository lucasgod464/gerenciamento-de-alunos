import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { User } from "@/types/user";
import { UserTags } from "./table/UserTags";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, checked: boolean) => void;
}

export function UserTableRow({
  user,
  onEdit,
  onDelete,
  onStatusChange,
}: UserTableRowProps) {
  const [authorizedRooms, setAuthorizedRooms] = useState<string[]>([]);

  useEffect(() => {
    const fetchAuthorizedRooms = async () => {
      const { data: roomsData, error } = await supabase
        .from('user_rooms')
        .select(`
          rooms (
            name
          )
        `)
        .eq('user_id', user.id);

      if (!error && roomsData) {
        const roomNames = roomsData
          .map(rd => rd.rooms?.name)
          .filter(Boolean) as string[];
        setAuthorizedRooms(roomNames);
      }
    };

    fetchAuthorizedRooms();
  }, [user.id]);

  return (
    <TableRow>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.specialization || "Não definido"}</TableCell>
      <TableCell>
        {authorizedRooms.length > 0 
          ? authorizedRooms.join(", ")
          : "Nenhuma sala autorizada"}
      </TableCell>
      <TableCell>
        <UserTags user={user} />
      </TableCell>
      <TableCell className="text-center">
        <Switch
          checked={user.status}
          onCheckedChange={(checked) => onStatusChange(user.id, checked)}
        />
      </TableCell>
      <TableCell>{new Date(user.createdAt || "").toLocaleDateString()}</TableCell>
      <TableCell>
        {user.lastAccess
          ? new Date(user.lastAccess).toLocaleDateString()
          : "Nunca"}
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(user)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(user.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}