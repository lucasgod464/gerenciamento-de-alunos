import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { UserFormFields } from "./UserFormFields";
import { useState, useEffect } from "react";
import { hashPassword } from "@/utils/passwordUtils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type UserFormData } from "@/schemas/userSchema";
import { Form } from "@/components/ui/form";

interface EditUserDialogProps {
  user: User | null;
  onClose: () => void;
  onSubmit: (user: User) => void;
}

export function EditUserDialog({ user, onClose, onSubmit: onUserSubmit }: EditUserDialogProps) {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      location: user?.location || "",
      specialization: user?.specialization || "",
      status: user?.status || "active",
      authorizedRooms: user?.authorizedRooms || [],
      responsibleCategory: user?.responsibleCategory || "",
    },
  });

  useEffect(() => {
    if (user?.authorizedRooms) {
      setSelectedRooms(user.authorizedRooms);
      form.setValue("authorizedRooms", user.authorizedRooms);
    }
  }, [user, form]);

  const handleAuthorizedRoomsChange = (roomIds: string[]) => {
    setSelectedRooms(roomIds);
    form.setValue("authorizedRooms", roomIds);
  };

  const onSubmit = async (data: UserFormData) => {
    if (!user) return;
    
    let password = user.password;
    if (data.password) {
      password = await hashPassword(data.password);
    }

    const updatedUser: User = {
      ...user,
      name: data.name,
      email: data.email,
      password,
      location: data.location,
      specialization: data.specialization,
      status: data.status,
      authorizedRooms: data.authorizedRooms,
      responsibleCategory: data.responsibleCategory,
    };

    onUserSubmit(updatedUser);
  };

  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UserFormFields 
              defaultValues={{
                name: user.name,
                email: user.email,
                password: "",
                location: user.location,
                specialization: user.specialization,
                status: user.status,
                authorizedRooms: user.authorizedRooms
              }}
              onAuthorizedRoomsChange={handleAuthorizedRoomsChange}
              isEditing={true}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}