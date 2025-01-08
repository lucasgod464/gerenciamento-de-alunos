import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { UserFormDialog } from "./dialog/UserFormDialog";

interface CreateUserDialogProps {
  onUserCreated?: () => void;
}

export function CreateUserDialog({ onUserCreated }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="mr-2 h-4 w-4" />
        Adicionar Usuário
      </Button>

      <UserFormDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={onUserCreated}
        title="Novo Usuário"
      />
    </>
  );
}