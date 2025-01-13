import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/types/user";
import { UserForm } from "../form/UserForm";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (user: User) => void;
  title: string;
  defaultValues?: Partial<User>;
  isEditing?: boolean;
}

export function UserFormDialog({
  open,
  onOpenChange,
  onSuccess,
  title,
  defaultValues,
  isEditing
}: UserFormDialogProps) {
  const handleSuccess = (updatedUser: User) => {
    console.log('UserFormDialog recebeu usuário atualizado:', updatedUser);
    onSuccess(updatedUser);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="pb-6">
          <UserForm
            onSuccess={handleSuccess}
            onCancel={() => onOpenChange(false)}
            defaultValues={defaultValues}
            isEditing={isEditing}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}