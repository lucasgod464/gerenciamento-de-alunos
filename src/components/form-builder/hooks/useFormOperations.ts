import { supabase } from "@/integrations/supabase/client";
import { FormField } from "@/types/form";
import { useToast } from "@/hooks/use-toast";

export const useFormOperations = () => {
  const { toast } = useToast();

  const updateField = async (field: FormField): Promise<FormField> => {
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

      return {
        id: data.id,
        name: data.name,
        label: data.label,
        type: data.type as FormField['type'],
        description: data.description || "",
        required: data.required || false,
        order: data.order,
        options: Array.isArray(data.options) ? data.options : undefined,
      };
    } catch (error) {
      console.error('Error updating field:', error);
      throw error;
    }
  };

  const addField = async (field: Omit<FormField, "id" | "order">, order: number): Promise<FormField> => {
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

      return {
        id: data.id,
        name: data.name,
        label: data.label,
        type: data.type as FormField['type'],
        description: data.description || "",
        required: data.required || false,
        order: data.order,
        options: Array.isArray(data.options) ? data.options : undefined,
      };
    } catch (error) {
      console.error('Error adding field:', error);
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
      throw error;
    }
  };

  return {
    updateField,
    addField,
    deleteField,
  };
};