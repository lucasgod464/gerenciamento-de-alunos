import { UserFormDialog } from "./dialog/UserFormDialog";
import { User } from "@/types/user";
import { useUsers } from "@/hooks/useUsers";
import { toast } from "sonner";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: (user: User) => void;
  user: User | null;
}

export function EditUserDialog({
  open,
  onOpenChange,
  onUserUpdated,
  user
}: EditUserDialogProps) {
  const { loadUsers } = useUsers();

  if (!user) return null;

  const handleSuccess = async (updatedUser: User) => {
    try {
      console.log('Usuário atualizado, notificando componente pai:', updatedUser);
      onUserUpdated(updatedUser);
      
      // Mostra mensagem de sucesso com toast
      toast.success("Usuário atualizado com sucesso!", {
        description: "As informações foram salvas e a lista será atualizada.",
        duration: 4000,
      });

      // Recarrega a lista de usuários
      await loadUsers();
      
      // Fecha o diálogo
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error("Erro ao atualizar usuário", {
        description: "Tente novamente em alguns instantes.",
      });
    }
  };

  return (
    <UserFormDialog
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={handleSuccess}
      title="Editar Usuário"
      defaultValues={{
        id: user.id,
        name: user.name,
        email: user.email,
        specialization: user.specialization || '',
        location: user.location || '',
        status: user.status,
        tags: user.tags || [],
        accessLevel: user.accessLevel,
        authorizedRooms: user.authorizedRooms || [],
        address: user.address || ''
      }}
      isEditing
    />
  );
}