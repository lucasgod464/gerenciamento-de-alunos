import { supabase } from "@/integrations/supabase/client";
import { FormField, mapSupabaseFormField, mapFormFieldToSupabase } from "@/types/form";

export const useFormOperations = () => {
  const loadFields = async (): Promise<FormField[]> => {
    try {
      const [{ data: adminFields }, { data: enrollmentFields }] = await Promise.all([
        supabase
          .from('admin_form_fields')
          .select('*')
          .order('order'),
        supabase
          .from('enrollment_form_fields')
          .select('*')
          .order('order')
      ]);

      const mappedAdminFields = (adminFields || []).map(field => mapSupabaseFormField({ ...field, form_type: 'admin' }));
      const mappedEnrollmentFields = (enrollmentFields || []).map(field => mapSupabaseFormField({ ...field, form_type: 'enrollment' }));

      return [...mappedAdminFields, ...mappedEnrollmentFields];
    } catch (error) {
      console.error('Error loading fields:', error);
      throw error;
    }
  };

  const addField = async (field: Omit<FormField, "id" | "order">, order: number): Promise<FormField> => {
    try {
      const supabaseField = mapFormFieldToSupabase({ ...field, id: '', order } as FormField);
      const tableName = field.formType === 'admin' ? 'admin_form_fields' : 'enrollment_form_fields';

      const { data, error } = await supabase
        .from(tableName)
        .insert([supabaseField])
        .select()
        .single();

      if (error) throw error;

      return mapSupabaseFormField(data);
    } catch (error) {
      console.error('Error adding field:', error);
      throw error;
    }
  };

  const updateField = async (field: FormField, editingField: FormField): Promise<FormField> => {
    try {
      const supabaseField = mapFormFieldToSupabase(field);
      const tableName = field.formType === 'admin' ? 'admin_form_fields' : 'enrollment_form_fields';

      const { data, error } = await supabase
        .from(tableName)
        .update({
          ...supabaseField,
          order: editingField.order,
        })
        .eq('id', editingField.id)
        .select()
        .single();

      if (error) throw error;

      return mapSupabaseFormField(data);
    } catch (error) {
      console.error('Error updating field:', error);
      throw error;
    }
  };

  const deleteField = async (id: string) => {
    try {
      const [{ error: adminError }, { error: enrollmentError }] = await Promise.all([
        supabase
          .from('admin_form_fields')
          .delete()
          .eq('id', id),
        supabase
          .from('enrollment_form_fields')
          .delete()
          .eq('id', id)
      ]);

      if (adminError && enrollmentError) throw adminError;
    } catch (error) {
      console.error('Error deleting field:', error);
      throw error;
    }
  };

  return {
    loadFields,
    addField,
    updateField,
    deleteField,
  };
};