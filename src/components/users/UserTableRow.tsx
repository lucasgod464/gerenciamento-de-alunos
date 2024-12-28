import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const userRooms = allRooms
      .filter((room: Room) => user.authorizedRooms?.includes(room.id))
      .map((room: Room) => room.name);
    
    setAuthorizedRoomNames(userRooms);
  }, [user.authorizedRooms]);

  const handleDelete = () => {
    onDelete(user.id);
    setShowDeleteDialog(false);
    toast({
      title: "Usuário excluído",
      description: "O usuário foi excluído com sucesso.",
    });
  };

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
            onCheckedChange={handleStatusChange}
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
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário {user.name}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}