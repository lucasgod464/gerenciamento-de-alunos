import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import UserFormFields from "../UserFormFields";

interface UserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
  defaultValues?: any;
}

export function UserForm({ onSuccess, onCancel, isEditing, defaultValues }: UserFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string; color: string; }[]>(
    defaultValues?.tags || []
  );
  const [selectedRooms, setSelectedRooms] = useState<string[]>(
    defaultValues?.authorizedRooms?.map((room: any) => room.id) || []
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
        access_level: formData.get('accessLevel') as "Admin" | "Usuário Comum" || "Usuário Comum", // Valor padrão definido
        status: formData.get('status') as string || 'active',
        company_id: user?.companyId,
      };

      console.log('Dados a serem atualizados:', userData);

      if (isEditing && defaultValues?.id) {
        // Atualiza informações básicas do usuário
        const { error: updateError } = await supabase
          .from('emails')
          .update(userData)
          .eq('id', defaultValues.id);

        if (updateError) {
          console.error('Erro ao atualizar usuário:', updateError);
          throw updateError;
        }

        // Atualiza tags
        await supabase
          .from('user_tags')
          .delete()
          .eq('user_id', defaultValues.id);

        if (selectedTags.length > 0) {
          const { error: tagsError } = await supabase
            .from('user_tags')
            .insert(selectedTags.map(tag => ({
              user_id: defaultValues.id,
              tag_id: tag.id
            })));

          if (tagsError) throw tagsError;
        }

        // Atualiza salas autorizadas
        await supabase
          .from('user_rooms')
          .delete()
          .eq('user_id', defaultValues.id);

        if (selectedRooms.length > 0) {
          const { error: roomsError } = await supabase
            .from('user_rooms')
            .insert(selectedRooms.map(roomId => ({
              user_id: defaultValues.id,
              room_id: roomId
            })));

          if (roomsError) throw roomsError;
        }

        // Atualiza especializações
        await supabase
          .from('user_specializations')
          .delete()
          .eq('user_id', defaultValues.id);

        if (selectedSpecializations.length > 0) {
          const { error: specsError } = await supabase
            .from('user_specializations')
            .insert(selectedSpecializations.map(specId => ({
              user_id: defaultValues.id,
              specialization_id: specId
            })));

          if (specsError) throw specsError;
        }

        toast.success('Usuário atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('emails')
          .insert([{
            ...userData,
            password: '123456', // Senha padrão para novos usuários
          }]);

        if (error) throw error;
        toast.success('Usuário criado com sucesso!');
      }

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
      <UserFormFields
        defaultValues={defaultValues}
        onTagsChange={setSelectedTags}
        onRoomsChange={setSelectedRooms}
        onSpecializationsChange={setSelectedSpecializations}
        isEditing={isEditing}
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