import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, UserCog, User, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { User as UserType } from "@/types/user";
import { UserTags } from "./table/UserTags";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UserTableRowProps {
  user: UserType;
  onEdit: (user: UserType) => void;
  onDelete: (id: string) => void;
  onView: (user: UserType) => void;
  onStatusChange: (id: string, checked: boolean) => void;
}

export function UserTableRow({
  user,
  onEdit,
  onDelete,
  onView,
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
    <TableRow className={isAdmin ? "bg-blue-50/50" : ""}>
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  {isAdmin ? (
                    <>
                      <UserCog className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-700">{user.name}</span>
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{user.name}</span>
                    </>
                  )}
                </div>
                <div className="mt-1">
                  {isAdmin ? (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                      Administrador
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200">
                      Usuário
                    </Badge>
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isAdmin ? "Usuário com privilégios administrativos" : "Usuário com acesso padrão"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        <span className={isAdmin ? "text-blue-700" : "text-gray-600"}>
          {user.email}
        </span>
      </TableCell>
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
            onClick={() => onView(user)}
            className="hover:text-blue-600"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(user)}
            className={isAdmin ? "hover:text-blue-600" : "hover:text-gray-700"}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(user.id)}
            className="hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}