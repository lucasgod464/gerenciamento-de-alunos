import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Tag } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Category } from "@/types/category";

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
  const [categoryName, setCategoryName] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const userRooms = allRooms
      .filter((room: Room) => user.authorizedRooms?.includes(room.id))
      .map((room: Room) => room.name);
    
    setAuthorizedRoomNames(userRooms);

    // Buscar o nome da categoria
    const categories: Category[] = JSON.parse(localStorage.getItem("categories") || "[]");
    const category = categories.find(cat => cat.id === user.responsibleCategory);
    setCategoryName(category?.name || "Categoria não encontrada");

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
        <TableCell className="font-medium">{user.name}</TableCell>
        <TableCell className="text-muted-foreground">{user.email}</TableCell>
        <TableCell>{categoryName}</TableCell>
        <TableCell>{user.specialization}</TableCell>
        <TableCell>
          <div className="max-w-[200px] overflow-hidden text-sm">
            {authorizedRoomNames.length > 0 
              ? authorizedRoomNames.join(", ")
              : "Nenhuma sala autorizada"}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1 max-w-[150px]">
            {userTags.map((tag) => (
              <TooltipProvider key={tag.id}>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center">
                      <Tag 
                        className="h-4 w-4" 
                        style={{ 
                          color: tag.color,
                          fill: tag.color,
                          fillOpacity: 0.2,
                        }} 
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tag.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {userTags.length === 0 && (
              <span className="text-muted-foreground text-xs">
                Sem etiquetas
              </span>
            )}
          </div>
        </TableCell>
        <TableCell className="text-center">
          <Switch
            checked={user.status === "active"}
            onCheckedChange={handleStatusChange}
          />
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">{user.createdAt}</TableCell>
        <TableCell className="text-sm text-muted-foreground">{user.lastAccess}</TableCell>
        <TableCell>
          <div className="flex justify-center space-x-2">
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