import { useState, useEffect } from "react";
import { FormField } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFormFields = () => {
  const { toast } = useToast();
  const [fields, setFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      setIsLoading(true);
      const { data: formFields, error } = await supabase
        .from('admin_form_fields')
        .select('*')
        .order('order');

      if (error) throw error;

      setFields(formFields || []);
    } catch (error) {
      console.error("Error loading form fields:", error);
      toast({
        title: "Erro ao carregar campos",
        description: "Não foi possível carregar os campos do formulário.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addField = async (field: Omit<FormField, "id" | "order">) => {
    try {
      const { data, error } = await supabase
        .from('admin_form_fields')
        .insert({
          ...field,
          order: fields.length,
        })
        .select()
        .single();

      if (error) throw error;

      setFields(prev => [...prev, data]);
      toast({
        title: "Campo adicionado",
        description: "O novo campo foi adicionado com sucesso.",
      });
      return true;
    } catch (error) {
      console.error("Error adding field:", error);
      toast({
        title: "Erro ao adicionar campo",
        description: "Não foi possível adicionar o campo.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateField = async (fieldId: string, updates: Partial<FormField>) => {
    try {
      const { error } = await supabase
        .from('admin_form_fields')
        .update(updates)
        .eq('id', fieldId);

      if (error) throw error;

      setFields(prev => prev.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      ));

      toast({
        title: "Campo atualizado",
        description: "O campo foi atualizado com sucesso.",
      });
      return true;
    } catch (error) {
      console.error("Error updating field:", error);
      toast({
        title: "Erro ao atualizar campo",
        description: "Não foi possível atualizar o campo.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteField = async (id: string) => {
    try {
      const { error } = await supabase
        .from('admin_form_fields')
        .delete()
        .eq('id', id);

      if (error) throw error;

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
    try {
      const updates = reorderedFields.map((field, index) => ({
        id: field.id,
        order: index,
      }));

      const { error } = await supabase
        .from('admin_form_fields')
        .upsert(updates);

      if (error) throw error;

      setFields(reorderedFields);
    } catch (error) {
      console.error("Error reordering fields:", error);
      toast({
        title: "Erro ao reordenar campos",
        description: "Não foi possível reordenar os campos.",
        variant: "destructive",
      });
    }
  };

  return {
    fields,
    isLoading,
    addField,
    updateField,
    deleteField,
    reorderFields,
  };
};