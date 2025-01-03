import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/user";

interface UserInfoDialogProps {
  user: User | null;
  onClose: () => void;
}

export function UserInfoDialog({ user, onClose }: UserInfoDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Informações do Usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <label className="font-semibold">Nome</label>
            <p className="text-sm text-muted-foreground">{user.name}</p>
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="font-semibold">Email</label>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          {user.location && (
            <div className="flex flex-col space-y-1.5">
              <label className="font-semibold">Local</label>
              <p className="text-sm text-muted-foreground">{user.location}</p>
            </div>
          )}
          {user.specialization && (
            <div className="flex flex-col space-y-1.5">
              <label className="font-semibold">Especialização</label>
              <p className="text-sm text-muted-foreground">{user.specialization}</p>
            </div>
          )}
          <div className="flex flex-col space-y-1.5">
            <label className="font-semibold">Nível de Acesso</label>
            <p className="text-sm text-muted-foreground">{user.accessLevel}</p>
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="font-semibold">Data de Criação</label>
            <p className="text-sm text-muted-foreground">{user.createdAt}</p>
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="font-semibold">Último Acesso</label>
            <p className="text-sm text-muted-foreground">{user.lastAccess || "Nunca acessou"}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}