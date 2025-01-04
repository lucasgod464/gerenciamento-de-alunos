import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import UserFormFields from "./UserFormFields";
import { User } from "@/types/user";

export interface CreateUserDialogProps {
  onUserCreated?: (user: User) => void;
}

export const CreateUserDialog = ({ onUserCreated }: CreateUserDialogProps) => {
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string; color: string; }[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
        </DialogHeader>
        <UserFormFields
          onTagsChange={setSelectedTags}
          onRoomsChange={setSelectedRooms}
        />
      </DialogContent>
    </Dialog>
  );
};