import { FormField } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCompanyId } from "./useCompanyId";

export const useFieldOperations = () => {
  const { toast } = useToast();
  const companyId = useCompanyId();

  const addField = async (field: Omit<FormField, "id" | "order">) => {
    try {
      const { data, error } = await supabase
        .from('admin_form_fields')
        .insert([{
          name: field.name,
          label: field.label,
          type: field.type,
          description: field.description,
          required: field.required,
          options: field.options || [],
          company_id: companyId,
          order: 0,
          form_type: 'admin'
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        label: data.label,
        type: data.type as FormField['type'],
        description: data.description || "",
        required: data.required || false,
        order: data.order,
        options: Array.isArray(data.options) ? data.options.map(String) : [],
        source: 'admin' as const
      };
    } catch (error) {
      console.error("Error adding field:", error);
      toast({
        title: "Erro ao adicionar campo",
        description: "Não foi possível adicionar o campo.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateField = async (field: FormField) => {
    try {
      // Validação para garantir que temos um ID válido
      if (!field.id) {
        throw new Error("ID do campo é necessário para atualização");
      }

      const { error } = await supabase
        .from('admin_form_fields')
        .update({
          name: field.name,
          label: field.label,
          type: field.type,
          description: field.description,
          required: field.required,
          options: field.options || [],
          order: field.order,
          company_id: companyId
        })
        .eq('id', field.id);

      if (error) throw error;

      return field;
    } catch (error) {
      console.error("Error updating field:", error);
      toast({
        title: "Erro ao atualizar campo",
        description: "Não foi possível atualizar o campo.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteField = async (id: string) => {
    try {
      // Validação para garantir que temos um ID válido
      if (!id) {
        throw new Error("ID do campo é necessário para remoção");
      }

      const { error } = await supabase
        .from('admin_form_fields')
        .delete()
        .eq('id', id)
        .eq('company_id', companyId);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting field:", error);
      toast({
        title: "Erro ao remover campo",
        description: "Não foi possível remover o campo.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    addField,
    updateField,
    deleteField,
  };
};