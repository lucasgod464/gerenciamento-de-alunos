import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

export function useUserUpdate() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updateUser = async (
    user: User,
    formData: FormData,
    selectedTags: { id: string; name: string; color: string }[],
    selectedRooms: string[],
    selectedSpecializations: string[]
  ) => {
    if (!user) return null;

    try {
      setLoading(true);
      console.log('Updating user with specializations:', selectedSpecializations);

      const updateData = {
        name: formData.get('name')?.toString() || '',
        email: formData.get('email')?.toString() || '',
        access_level: formData.get('accessLevel')?.toString() as "Admin" | "Usuário Comum",
        location: formData.get('location')?.toString() || '',
        status: formData.get('status')?.toString() || 'active',
        address: formData.get('address')?.toString() || '',
        specialization: formData.get('specialization')?.toString() || ''
      };

      // Update user basic info
      const { data: updatedUser, error: updateError } = await supabase
        .from('emails')
        .update(updateData)
        .eq('id', user.id)
        .select('*')
        .single();

      if (updateError) throw updateError;

      // Update tags
      await supabase
        .from('user_tags')
        .delete()
        .eq('user_id', user.id);

      if (selectedTags.length > 0) {
        await supabase
          .from('user_tags')
          .insert(selectedTags.map(tag => ({
            user_id: user.id,
            tag_id: tag.id
          })));
      }

      // Update specializations
      console.log('Deleting existing specializations for user:', user.id);
      const { error: deleteSpecError } = await supabase
        .from('user_specializations')
        .delete()
        .eq('user_id', user.id);

      if (deleteSpecError) {
        console.error('Error deleting specializations:', deleteSpecError);
        throw deleteSpecError;
      }

      if (selectedSpecializations.length > 0) {
        console.log('Inserting new specializations:', selectedSpecializations);
        const { error: insertSpecError } = await supabase
          .from('user_specializations')
          .insert(
            selectedSpecializations.map(specId => ({
              user_id: user.id,
              specialization_id: specId
            }))
          );

        if (insertSpecError) {
          console.error('Error inserting specializations:', insertSpecError);
          throw insertSpecError;
        }
      }

      // Update rooms
      await supabase
        .from('user_rooms')
        .delete()
        .eq('user_id', user.id);

      if (selectedRooms.length > 0) {
        await supabase
          .from('user_rooms')
          .insert(selectedRooms.map(roomId => ({
            user_id: user.id,
            room_id: roomId
          })));
      }

      // Fetch updated room names and specializations
      const [roomsResponse, specializationsResponse] = await Promise.all([
        supabase
          .from('rooms')
          .select('id, name')
          .in('id', selectedRooms),
        supabase
          .from('specializations')
          .select('id, name')
          .in('id', selectedSpecializations)
      ]);

      const updatedUserData: User = {
        ...user,
        ...updateData,
        tags: selectedTags,
        authorizedRooms: roomsResponse.data?.map(room => ({ 
          id: room.id, 
          name: room.name 
        })) || [],
        specialization: updateData.specialization
      };

      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso.",
      });

      return updatedUserData;
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Erro ao atualizar usuário",
        description: "Ocorreu um erro ao atualizar as informações do usuário.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUser,
    loading
  };
}