import { UserFormDialog } from "./dialog/UserFormDialog";
import { User } from "@/types/user";
import { useUsers } from "@/hooks/useUsers";

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
    console.log('Usuário atualizado, notificando componente pai:', updatedUser);
    onUserUpdated(updatedUser);
    await loadUsers(); // Recarrega a lista de usuários após a atualização
    onOpenChange(false);
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