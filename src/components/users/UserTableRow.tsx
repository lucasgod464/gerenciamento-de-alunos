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

interface Tag {
  id: string;
  name: string;
  color: string;
}

export function UserTableRow({ user, onEdit, onDelete, onStatusChange }: UserTableRowProps) {
  const [authorizedRoomNames, setAuthorizedRoomNames] = useState<string[]>([]);
  const [userTags, setUserTags] = useState<Tag[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const userRooms = allRooms
      .filter((room: Room) => user.authorizedRooms?.includes(room.id))
      .map((room: Room) => room.name);
    
    setAuthorizedRoomNames(userRooms);

    // Load tags
    if (user.companyId) {
      const storageKey = `company_${user.companyId}_tags`;
      const savedTags = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const userTagDetails = savedTags
        .filter((tag: Tag) => user.tags?.includes(tag.id))
        .map((tag: Tag) => ({
          id: tag.id,
          name: tag.name,
          color: tag.color,
        }));
      setUserTags(userTagDetails);
    }
  }, [user]);

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
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {userTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: tag.color,
                  color: getContrastColor(tag.color),
                }}
              >
                {tag.name}
              </span>
            ))}
            {userTags.length === 0 && (
              <span className="text-muted-foreground text-sm">
                Sem etiquetas
              </span>
            )}
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

// Utility function to determine text color based on background color
function getContrastColor(hexcolor: string) {
  // Convert hex to RGB
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}