import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FormField, SupabaseFormField, mapSupabaseFormField, mapFormFieldToSupabase } from "../types";

export const useFormOperations = () => {
  const { toast } = useToast();

  const addField = async (field: Omit<FormField, "id" | "order">, currentOrder: number) => {
    try {
      const supabaseField = mapFormFieldToSupabase({
        ...field,
        id: '',
        order: currentOrder,
      });

      const { data, error } = await supabase
        .from('admin_form_fields')
        .insert([{ ...supabaseField, order: currentOrder }])
        .select()
        .single();

      if (error) throw error;

      const mappedField = mapSupabaseFormField(data as SupabaseFormField);
      
      toast({
        title: "Campo adicionado",
        description: "O novo campo foi adicionado com sucesso.",
      });

      return mappedField;
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
      const supabaseField = mapFormFieldToSupabase(field);
      const { error } = await supabase
        .from('admin_form_fields')
        .update({
          ...supabaseField,
          order: field.order,
        })
        .eq('id', field.id);

      if (error) throw error;

      toast({
        title: "Campo atualizado",
        description: "O campo foi atualizado com sucesso.",
      });

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
      const { error } = await supabase
        .from('admin_form_fields')
        .delete()
        .eq('id', id);

      if (error) throw error;

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
      throw error;
    }
  };

  const reorderFields = async (reorderedFields: FormField[]) => {
    try {
      const updates = reorderedFields.map((field, index) => ({
        id: field.id,
        order: index,
      }));

      const { error } = await supabase
        .from('admin_form_fields')
        .upsert(updates);

      if (error) throw error;

      return reorderedFields;
    } catch (error) {
      console.error("Error reordering fields:", error);
      toast({
        title: "Erro ao reordenar campos",
        description: "Não foi possível reordenar os campos.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    addField,
    updateField,
    deleteField,
    reorderFields,
  };
};