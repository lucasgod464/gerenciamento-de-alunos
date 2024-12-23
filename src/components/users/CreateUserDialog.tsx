import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserFormFields } from "./UserFormFields";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { useState } from "react";
import { hashPassword } from "@/utils/passwordUtils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type UserFormData } from "@/schemas/userSchema";
import { Form } from "@/components/ui/form";

interface CreateUserDialogProps {
  onUserCreated: (user: User) => void;
}

export function CreateUserDialog({ onUserCreated }: CreateUserDialogProps) {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      location: "",
      specialization: "",
      status: "active",
      authorizedRooms: [],
      responsibleCategory: "",
    },
  });

  const handleAuthorizedRoomsChange = (roomIds: string[]) => {
    setSelectedRooms(roomIds);
    form.setValue("authorizedRooms", roomIds);
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      const hashedPassword = await hashPassword(data.password as string);
      const id = Math.random().toString(36).substr(2, 9);

      const newUser: User = {
        id,
        name: data.name,
        email: data.email,
        password: hashedPassword,
        responsibleCategory: data.responsibleCategory,
        location: data.location,
        specialization: data.specialization,
        status: data.status,
        createdAt: new Date().toLocaleDateString(),
        lastAccess: "-",
        companyId: currentUser?.companyId || null,
        authorizedRooms: data.authorizedRooms,
      };

      // Get existing users and filter out any with the same email
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUserWithEmail = users.find((u: User) => u.email === data.email);
      
      if (existingUserWithEmail) {
        toast({
          title: "Erro",
          description: "Já existe um usuário com este email.",
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem("users", JSON.stringify([...users, newUser]));
      onUserCreated(newUser);
      
      toast({
        title: "Usuário criado",
        description: "O usuário foi criado com sucesso.",
      });

      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o usuário.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Criar Usuário</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Usuário</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UserFormFields onAuthorizedRoomsChange={handleAuthorizedRoomsChange} />
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="submit">Criar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}