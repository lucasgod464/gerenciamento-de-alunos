import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "../form/UserForm";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  title: string;
  defaultValues?: any;
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto py-4">
          <UserForm
            onSuccess={() => {
              onSuccess?.();
              onOpenChange(false);
            }}
            onCancel={() => onOpenChange(false)}
            defaultValues={defaultValues}
            isEditing={isEditing}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}