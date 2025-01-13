import { FormField } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFieldOperations = () => {
  const { toast } = useToast();

  const addField = async (field: Omit<FormField, "id" | "order"> & { company_id: string }, order: number) => {
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
          company_id: field.company_id,
          order,
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
        options: Array.isArray(data.options) ? data.options : undefined,
        source: 'admin' as const
      };
    } catch (error) {
      console.error("Error adding field:", error);
      throw error;
    }
  };

  const updateField = async (field: FormField & { company_id: string }) => {
    try {
      const { data, error } = await supabase
        .from('admin_form_fields')
        .update({
          name: field.name,
          label: field.label,
          type: field.type,
          description: field.description,
          required: field.required,
          options: field.options || [],
          order: field.order,
          company_id: field.company_id
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
        source: 'admin' as const
      };
    } catch (error) {
      console.error("Error updating field:", error);
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
      console.error("Error deleting field:", error);
      throw error;
    }
  };

  return {
    addField,
    updateField,
    deleteField,
  };
};
