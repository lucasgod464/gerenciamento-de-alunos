import { supabase } from "@/integrations/supabase/client";
import { FormField } from "@/types/form";
import { useToast } from "@/hooks/use-toast";
import { useCompanyId } from "./useCompanyId";

export const useFormOperations = () => {
  const { toast } = useToast();
  const companyId = useCompanyId();

  const updateField = async (field: FormField): Promise<FormField> => {
    try {
      if (!companyId) {
        throw new Error("Company ID not found");
      }

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
          company_id: companyId
        })
        .eq('id', field.id)
        .eq('company_id', companyId)
        .select()
        .single();

      if (error) throw error;

      if (!data) throw new Error("No data returned from update");

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
      console.error('Error updating field:', error);
      throw error;
    }
  };

  const addField = async (field: Omit<FormField, "id" | "order">, order: number): Promise<FormField> => {
    try {
      if (!companyId) {
        throw new Error("Company ID not found");
      }

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
          company_id: companyId,
          form_type: 'admin'
        }])
        .select()
        .single();

      if (error) throw error;

      if (!data) throw new Error("No data returned from insert");

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
      console.error('Error adding field:', error);
      throw error;
    }
  };

  const deleteField = async (id: string) => {
    try {
      if (!companyId) {
        throw new Error("Company ID not found");
      }

      const { error } = await supabase
        .from('admin_form_fields')
        .delete()
        .eq('id', id)
        .eq('company_id', companyId);

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