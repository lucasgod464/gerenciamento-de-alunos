import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { TagSelectionFields } from "../fields/TagSelectionFields";
import { RoomSelectionFields } from "../fields/RoomSelectionFields";
import { SpecializationSelectionFields } from "../fields/SpecializationSelectionFields";

interface UserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
  defaultValues?: {
    id?: string;
    name?: string;
    email?: string;
    location?: string;
    address?: string;
    specialization?: string;
    accessLevel?: string;
    status?: string;
    tags?: { id: string; name: string; color: string; }[];
    authorizedRooms?: { id: string; name: string; }[];
  };
}

export function UserForm({ onSuccess, onCancel, isEditing, defaultValues }: UserFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string; color: string; }[]>(
    defaultValues?.tags || []
  );
  const [selectedRooms, setSelectedRooms] = useState<string[]>(
    defaultValues?.authorizedRooms?.map(room => room.id) || []
  );
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const userData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        location: formData.get('location') as string,
        address: formData.get('address') as string,
        specialization: formData.get('specialization') as string,
        access_level: formData.get('accessLevel') as string,
        status: formData.get('status') as string,
        company_id: user?.companyId,
        password: '123456', // Senha padrão para novos usuários
      };

      if (isEditing && defaultValues?.id) {
        const { error } = await supabase
          .from('emails')
          .update(userData)
          .eq('id', defaultValues.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('emails')
          .insert([userData]);

        if (error) throw error;
      }

      toast.success(isEditing ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      toast.error('Erro ao salvar usuário');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultValues?.name}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={defaultValues?.email}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Local</Label>
        <Input
          id="location"
          name="location"
          defaultValue={defaultValues?.location}
          placeholder="Digite o local..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          name="address"
          defaultValue={defaultValues?.address}
          placeholder="Digite o endereço completo..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="accessLevel">Nível de Acesso</Label>
        <Select name="accessLevel" defaultValue={defaultValues?.accessLevel || "Usuário Comum"}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o nível de acesso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Usuário Comum">Usuário Comum</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={defaultValues?.status || "active"}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TagSelectionFields
        selectedTags={selectedTags}
        onTagToggle={(tag) => {
          const newSelectedTags = selectedTags.some(t => t.id === tag.id)
            ? selectedTags.filter(t => t.id !== tag.id)
            : [...selectedTags, tag];
          setSelectedTags(newSelectedTags);
        }}
        defaultValues={defaultValues}
      />

      <SpecializationSelectionFields
        selectedSpecializations={selectedSpecializations}
        onSpecializationToggle={(specializationId) => {
          const newSelectedSpecializations = selectedSpecializations.includes(specializationId)
            ? selectedSpecializations.filter(id => id !== specializationId)
            : [...selectedSpecializations, specializationId];
          setSelectedSpecializations(newSelectedSpecializations);
        }}
        defaultValues={defaultValues}
      />

      <RoomSelectionFields
        selectedRooms={selectedRooms}
        onRoomToggle={(roomId) => {
          const newSelectedRooms = selectedRooms.includes(roomId)
            ? selectedRooms.filter(id => id !== roomId)
            : [...selectedRooms, roomId];
          setSelectedRooms(newSelectedRooms);
        }}
        defaultValues={defaultValues}
      />

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : (isEditing ? "Salvar Alterações" : "Criar Usuário")}
        </Button>
      </div>
    </form>
  );
}