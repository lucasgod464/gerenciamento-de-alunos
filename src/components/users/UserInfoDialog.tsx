import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/types/user";
import { format } from "date-fns";

interface UserInfoDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserInfoDialog({ user, open, onOpenChange }: UserInfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Informações do Usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Nome</h3>
            <p className="text-sm text-muted-foreground">{user.name}</p>
          </div>
          <div>
            <h3 className="font-medium">Email</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div>
            <h3 className="font-medium">Nível de Acesso</h3>
            <p className="text-sm text-muted-foreground">{user.accessLevel}</p>
          </div>
          <div>
            <h3 className="font-medium">Data de Criação</h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm')}
            </p>
          </div>
          <div>
            <h3 className="font-medium">Último Acesso</h3>
            <p className="text-sm text-muted-foreground">
              {user.lastAccess ? format(new Date(user.lastAccess), 'dd/MM/yyyy HH:mm') : 'Nunca acessou'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}