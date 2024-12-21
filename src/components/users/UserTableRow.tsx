import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";
import { User } from "@/types/user";
import { useEffect, useState } from "react";

interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, checked: boolean) => void;
}

interface Room {
  id: string;
  name: string;
  status: boolean;
}

export function UserTableRow({ user, onEdit, onDelete, onStatusChange }: UserTableRowProps) {
  const [authorizedRoomNames, setAuthorizedRoomNames] = useState<string[]>([]);

  useEffect(() => {
    // Carregar todas as salas do localStorage
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    
    // Filtrar apenas as salas autorizadas para este usuário
    const userRooms = allRooms
      .filter((room: Room) => user.authorizedRooms?.includes(room.id))
      .map((room: Room) => room.name);
    
    setAuthorizedRoomNames(userRooms);
  }, [user.authorizedRooms]);

  return (
    <TableRow>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.responsibleCategory}</TableCell>
      <TableCell>{user.specialization}</TableCell>
      <TableCell>
        <div className="max-w-[200px] overflow-hidden">
          {authorizedRoomNames.length > 0 
            ? authorizedRoomNames.join(", ")
            : "Nenhuma sala autorizada"}
        </div>
      </TableCell>
      <TableCell>
        <Switch
          checked={user.status === "active"}
          onCheckedChange={(checked) => onStatusChange(user.id, checked)}
        />
      </TableCell>
      <TableCell>{user.createdAt}</TableCell>
      <TableCell>{user.lastAccess}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(user)}
          >
            <Pencil className="h-4 w-4" />
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