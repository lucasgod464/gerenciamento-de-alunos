import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, AccessLevel } from "@/types/user";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RoomSelectionFields } from "./fields/RoomSelectionFields";
import { TagSelectionFields } from "./fields/TagSelectionFields";

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: (user: User) => void;
}

export function EditUserDialog({ user, open, onOpenChange, onUserUpdated }: EditUserDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string; color: string; }[]>([]);

  useEffect(() => {
    if (user) {
      setFormData(user);
      setNewPassword("");
      setSelectedRooms(user.authorizedRooms || []);
      setSelectedTags(user.tags || []);
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData) return;

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        access_level: formData.access_level,
        location: formData.location || null,
        specialization: formData.specialization || null,
      };

      if (newPassword) {
        updateData.password = newPassword;
      }

      // Update user data
      const { data, error } = await supabase
        .from('emails')
        .update(updateData)
        .eq('id', formData.id)
        .select()
        .single();

      if (error) throw error;

      // Update authorized rooms
      await supabase
        .from('user_authorized_rooms')
        .delete()
        .eq('user_id', formData.id);

      if (selectedRooms.length > 0) {
        const roomsData = selectedRooms.map(roomId => ({
          user_id: formData.id,
          room_id: roomId,
        }));

        const { error: roomsError } = await supabase
          .from('user_authorized_rooms')
          .insert(roomsData);

        if (roomsError) throw roomsError;
      }

      // Update user tags
      await supabase
        .from('user_tags')
        .delete()
        .eq('user_id', formData.id);

      if (selectedTags.length > 0) {
        const tagsData = selectedTags.map(tag => ({
          user_id: formData.id,
          tag_id: tag.id,
        }));

        const { error: tagsError } = await supabase
          .from('user_tags')
          .insert(tagsData);

        if (tagsError) throw tagsError;
      }

      const updatedUser: User = {
        ...formData,
        ...data,
        authorizedRooms: selectedRooms,
        tags: selectedTags,
        role: data.access_level === 'Admin' ? 'ADMIN' : 'USER',
      };

      onUserUpdated(updatedUser);
      onOpenChange(false);
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o usuário.",
        variant: "destructive",
      });
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialization">Especialização</Label>
            <Input
              id="specialization"
              value={formData.specialization || ''}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Nova Senha (opcional)</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha se desejar alterá-la"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="access_level">Nível de Acesso</Label>
            <Select
              value={formData.access_level}
              onValueChange={(value: AccessLevel) => 
                setFormData({ ...formData, access_level: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Administrador</SelectItem>
                <SelectItem value="Usuário Comum">Usuário Comum</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <RoomSelectionFields
            selectedRooms={selectedRooms}
            onRoomToggle={(roomId) => {
              setSelectedRooms(prev => 
                prev.includes(roomId) 
                  ? prev.filter(id => id !== roomId)
                  : [...prev, roomId]
              );
            }}
          />

          <TagSelectionFields
            selectedTags={selectedTags}
            onTagToggle={(tag) => {
              setSelectedTags(prev => 
                prev.some(t => t.id === tag.id)
                  ? prev.filter(t => t.id !== tag.id)
                  : [...prev, tag]
              );
            }}
          />

          <Button type="submit" className="w-full">
            Salvar Alterações
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}