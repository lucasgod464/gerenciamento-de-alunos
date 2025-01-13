import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { UserFormDialog } from "./dialog/UserFormDialog";
import { useCompanies } from "@/hooks/useCompanies";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface CreateUserDialogProps {
  onUserCreated?: () => void;
}

export function CreateUserDialog({ onUserCreated }: CreateUserDialogProps) {
  const { companies } = useCompanies();
  const { toast } = useToast();
  const { user } = useAuth(); // useAuth import added here
  const currentUser = user;
  const [open, setOpen] = useState(false);

  const handleCreate = async () => {
    try {
      const company = companies.find(c => c.id === currentUser?.companyId);
      if (company && company.currentUsers >= company.usersLimit) {
        throw new Error("Limite de usuários atingido para esta empresa.");
      }
      
      onUserCreated?.();
      setOpen(false);
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      toast({
        title: "Erro ao criar usuário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="mr-2 h-4 w-4" />
        Adicionar Usuário
      </Button>

      <UserFormDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={handleCreate}
        title="Novo Usuário"
      />
    </>
  );
}
