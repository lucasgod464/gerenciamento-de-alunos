import { supabase } from "@/integrations/supabase/client";
import { FormField, SupabaseFormField, mapSupabaseFormField } from "@/types/form";
import { useToast } from "@/hooks/use-toast";

export const useFormOperations = () => {
  const { toast } = useToast();

  const updateField = async (field: FormField) => {
    try {
      const { data, error } = await supabase
        .from('admin_form_fields')
        .update({
          name: field.name,
          label: field.label,
          type: field.type,
          description: field.description,
          required: field.required,
          options: field.options || null,
          order: field.order,
        })
        .eq('id', field.id)
        .select()
        .single();

      if (error) throw error;

      return mapSupabaseFormField(data as SupabaseFormField);
    } catch (error) {
      console.error('Error updating field:', error);
      toast({
        title: "Erro ao atualizar campo",
        description: "Não foi possível atualizar o campo do formulário.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addField = async (field: Omit<FormField, "id" | "order">, order: number) => {
    try {
      const { data, error } = await supabase
        .from('admin_form_fields')
        .insert([{
          name: field.name,
          label: field.label,
          type: field.type,
          description: field.description,
          required: field.required,
          options: field.options || null,
          order,
        }])
        .select()
        .single();

      if (error) throw error;

      return mapSupabaseFormField(data as SupabaseFormField);
    } catch (error) {
      console.error('Error adding field:', error);
      toast({
        title: "Erro ao adicionar campo",
        description: "Não foi possível adicionar o campo ao formulário.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteField = async (id: string) => {
    try {
      const { error } = await supabase
        .from('admin_form_fields')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting field:', error);
      toast({
        title: "Erro ao excluir campo",
        description: "Não foi possível excluir o campo do formulário.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    updateField,
    addField,
    deleteField,
  };
};