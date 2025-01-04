import { TableCell, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserActions } from "./table/UserActions";
import { UserTags } from "./table/UserTags";
import { UserInfoDialog } from "./UserInfoDialog";
import { supabase } from "@/integrations/supabase/client";

interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, checked: boolean) => void;
}

export function UserTableRow({ user, onEdit, onDelete, onStatusChange }: UserTableRowProps) {
  const [authorizedRoomNames, setAuthorizedRoomNames] = useState<string[]>([]);
  const [showingInfo, setShowingInfo] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data: userRooms, error } = await supabase
          .from('user_rooms')
          .select('room_id')
          .eq('user_id', user.id);

        if (error) throw error;

        if (userRooms?.length) {
          const roomIds = userRooms.map(ur => ur.room_id);
          const { data: rooms } = await supabase
            .from('rooms')
            .select('name')
            .in('id', roomIds);

          if (rooms) {
            setAuthorizedRoomNames(rooms.map(room => room.name));
          }
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, [user.id]);

  const handleStatusChange = (checked: boolean) => {
    onStatusChange(user.id, checked);
    toast({
      title: "Status atualizado",
      description: `O usuário foi ${checked ? 'ativado' : 'desativado'} com sucesso.`,
    });
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{user.name}</TableCell>
        <TableCell className="text-muted-foreground">{user.email}</TableCell>
        <TableCell>{user.specialization || "Não definida"}</TableCell>
        <TableCell>
          <div className="max-w-[200px] overflow-hidden text-sm">
            {authorizedRoomNames.length > 0 
              ? authorizedRoomNames.join(", ")
              : "Nenhuma sala autorizada"}
          </div>
        </TableCell>
        <TableCell>
          <UserTags tags={user.tags} />
        </TableCell>
        <TableCell className="text-center">
          <Switch
            checked={user.status === "active"}
            onCheckedChange={handleStatusChange}
          />
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {user.createdAt}
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {user.lastAccess}
        </TableCell>
        <TableCell>
          <UserActions 
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={setShowingInfo}
          />
        </TableCell>
      </TableRow>

      <UserInfoDialog 
        user={showingInfo} 
        onClose={() => setShowingInfo(null)} 
      />
    </>
  );
}