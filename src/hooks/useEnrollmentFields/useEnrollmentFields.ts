import { useState, useEffect } from "react";
import { FormField, mapSupabaseFormField, mapFormFieldToSupabase } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { defaultFields } from "./defaultFields";
import { useAuth } from "@/hooks/useAuth";

export const useEnrollmentFields = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadFields = async () => {
    try {
      if (!user?.companyId) {
        console.error("No company ID found");
        return;
      }

      const { data: customFields, error } = await supabase
        .from('enrollment_form_fields')
        .select('*')
        .eq('company_id', user.companyId)
        .order('order');

      if (error) {
        console.error("Error loading fields:", error);
        throw error;
      }

      console.log("Loaded custom fields:", customFields);
      const mappedCustomFields = (customFields || []).map(mapSupabaseFormField);
      
      // Combine default fields with custom fields
      const allFields = [...defaultFields, ...mappedCustomFields];
      
      // Sort fields by order
      const sortedFields = allFields.sort((a, b) => a.order - b.order);
      
      setFields(sortedFields);
    } catch (error) {
      console.error("Error loading enrollment fields:", error);
      toast({
        title: "Erro ao carregar campos",
        description: "Não foi possível carregar os campos do formulário.",
        variant: "destructive",
      });
    }
  };

  const addField = async (field: Omit<FormField, "id" | "order">) => {
    try {
      if (!user?.companyId) {
        throw new Error("No company ID found");
      }

      const newField = {
        ...mapFormFieldToSupabase(field as FormField),
        order: fields.length,
        company_id: user.companyId
      };

      console.log("Adding new field:", newField);

      const { data, error } = await supabase
        .from('enrollment_form_fields')
        .insert([newField])
        .select()
        .single();

      if (error) {
        console.error("Error adding field:", error);
        throw error;
      }

      console.log("Field added successfully:", data);
      const mappedField = mapSupabaseFormField(data);
      setFields(prev => [...prev, mappedField]);
      
      toast({
        title: "Campo adicionado",
        description: "O novo campo foi adicionado com sucesso.",
      });
    } catch (error) {
      console.error("Error adding field:", error);
      toast({
        title: "Erro ao adicionar campo",
        description: "Não foi possível adicionar o campo.",
        variant: "destructive",
      });
    }
  };

  const updateField = async (updatedField: FormField) => {
    const isDefaultField = defaultFields.some(field => field.id === updatedField.id);
    if (isDefaultField) {
      toast({
        title: "Operação não permitida",
        description: "Não é possível editar campos padrão do formulário.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!user?.companyId) {
        throw new Error("No company ID found");
      }

      const supabaseField = mapFormFieldToSupabase(updatedField);
      console.log("Updating field:", { id: updatedField.id, ...supabaseField });

      const { error } = await supabase
        .from('enrollment_form_fields')
        .update({
          ...supabaseField,
          company_id: user.companyId
        })
        .eq('id', updatedField.id)
        .eq('company_id', user.companyId);

      if (error) {
        console.error("Error updating field:", error);
        throw error;
      }

      console.log("Field updated successfully");
      setFields(prev => prev.map(field => 
        field.id === updatedField.id ? updatedField : field
      ));

      toast({
        title: "Campo atualizado",
        description: "O campo foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Error updating field:", error);
      toast({
        title: "Erro ao atualizar campo",
        description: "Não foi possível atualizar o campo.",
        variant: "destructive",
      });
    }
  };

  const deleteField = async (id: string) => {
    const isDefaultField = defaultFields.some(field => field.id === id);
    if (isDefaultField) {
      toast({
        title: "Operação não permitida",
        description: "Não é possível excluir campos padrão do formulário.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('enrollment_form_fields')
        .delete()
        .eq('id', id)
        .eq('company_id', user?.companyId);

      if (error) {
        console.error("Error deleting field:", error);
        throw error;
      }

      console.log("Field deleted successfully");
      setFields(prev => prev.filter(field => field.id !== id));
      toast({
        title: "Campo removido",
        description: "O campo foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting field:", error);
      toast({
        title: "Erro ao remover campo",
        description: "Não foi possível remover o campo.",
        variant: "destructive",
      });
    }
  };

  const reorderFields = async (reorderedFields: FormField[]) => {
    if (!user?.companyId) {
      console.error("No company ID found");
      return;
    }

    // Separate default fields and custom fields
    const customFields = reorderedFields.filter(field => !defaultFields.some(df => df.id === field.id));
    
    try {
      const updates = customFields.map((field, index) => ({
        id: field.id,
        ...mapFormFieldToSupabase(field),
        order: defaultFields.length + index,
        company_id: user.companyId
      }));

      console.log("Reordering fields:", updates);

      const { error } = await supabase
        .from('enrollment_form_fields')
        .upsert(updates);

      if (error) {
        console.error("Error reordering fields:", error);
        throw error;
      }

      console.log("Fields reordered successfully");
      setFields(reorderedFields);
    } catch (error) {
      console.error("Error reordering fields:", error);
      toast({
        title: "Erro ao reordenar campos",
        description: "Não foi possível atualizar a ordem dos campos.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user?.companyId) {
      loadFields();
    }
  }, [user?.companyId]);

  return {
    fields,
    addField,
    deleteField,
    updateField,
    reorderFields,
  };
};