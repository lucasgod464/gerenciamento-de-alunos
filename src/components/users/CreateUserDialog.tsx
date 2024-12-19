import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/user";

interface CreateUserDialogProps {
  onUserCreated: (user: User) => void;
}

export function CreateUserDialog({ onUserCreated }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const generateUniqueId = () => {
    return Math.floor(100000000 + Math.random() * 900000000).toString();
  };

  const generateStrongPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const uniqueId = generateUniqueId();
    const newUser: User = {
      id: uniqueId,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      responsibleRoom: formData.get("responsibleRoom") as string,
      location: formData.get("location") as string,
      specialization: formData.get("specialization") as string,
      status: formData.get("status") as "active" | "inactive",
      createdAt: new Date().toLocaleDateString(),
      lastAccess: "-",
    };
    
    onUserCreated(newUser);
    setOpen(false);
    toast({
      title: "Usuário criado",
      description: "O usuário foi criado com sucesso.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Novo Usuário</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para criar um novo usuário no sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              name="name"
              placeholder="Digite o nome completo"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Digite o email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="flex gap-2">
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Digite a senha"
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const input = document.getElementById("password") as HTMLInputElement;
                  input.value = generateStrongPassword();
                }}
              >
                Gerar
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="responsibleRoom">Sala Responsável</Label>
            <Select name="responsibleRoom" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a sala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sala1">Sala 1</SelectItem>
                <SelectItem value="sala2">Sala 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              name="location"
              placeholder="Digite o local"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialization">Especialização</Label>
            <Select name="specialization" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a especialização" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="esp1">Especialização 1</SelectItem>
                <SelectItem value="esp2">Especialização 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue="active" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Criar Usuário
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}