import { UserFormDialog } from "./dialog/UserFormDialog";
import { User } from "@/types/user";

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
  if (!user) return null;

  return (
    <UserFormDialog
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={() => {
        onUserUpdated(user);
        onOpenChange(false);
      }}
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