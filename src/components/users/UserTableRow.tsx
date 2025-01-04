import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, UserCog, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { User as UserType } from "@/types/user";
import { UserTags } from "./table/UserTags";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface UserTableRowProps {
  user: UserType;
  onEdit: (user: UserType) => void;
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

  const isAdmin = user.accessLevel === "Admin";

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <UserCog className="h-4 w-4 text-blue-600" />
              <span>{user.name}</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Admin
              </Badge>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span>{user.name}</span>
            </div>
          )}
        </div>
      </TableCell>
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
          checked={user.status === 'active'}
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