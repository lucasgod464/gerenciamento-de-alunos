import { useState, useEffect } from "react";
import { FormField, SupabaseFormField, mapSupabaseFormField } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFormFields = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const { toast } = useToast();

  const loadFields = async () => {
    try {
      const { data: customFields, error } = await supabase
        .from('admin_form_fields')
        .select('*')
        .order('order');

      if (error) throw error;

      const mappedFields = (customFields as SupabaseFormField[]).map(mapSupabaseFormField);
      setFields(mappedFields);
    } catch (error) {
      console.error("Error loading form fields:", error);
      toast({
        title: "Erro ao carregar campos",
        description: "Não foi possível carregar os campos do formulário.",
        variant: "destructive",
      });
    }
  };

  const handleAddField = async (field: Omit<FormField, "id" | "order">) => {
    try {
      const newField = {
        ...field,
        order: fields.length,
      };

      const { data, error } = await supabase
        .from('admin_form_fields')
        .insert([newField])
        .select()
        .single();

      if (error) throw error;

      const mappedField = mapSupabaseFormField(data as SupabaseFormField);
      setFields(prev => [...prev, mappedField]);
      
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

  const handleUpdateField = async (fieldId: string, updates: Partial<Omit<FormField, "id">>) => {
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

  const handleDeleteField = async (fieldId: string) => {
    try {
      const { error } = await supabase
        .from('admin_form_fields')
        .delete()
        .eq('id', fieldId);

      if (error) throw error;

      setFields(prev => prev.filter(field => field.id !== fieldId));
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

  const handleReorderFields = async (reorderedFields: FormField[]) => {
    try {
      const updates = reorderedFields.map((field, index) => ({
        id: field.id,
        order: index,
      }));

      const { error } = await supabase
        .from('admin_form_fields')
        .upsert(updates.map(update => ({
          id: update.id,
          order: update.order,
          // Incluindo campos obrigatórios para o upsert
          name: reorderedFields.find(f => f.id === update.id)?.name || '',
          label: reorderedFields.find(f => f.id === update.id)?.label || '',
          type: reorderedFields.find(f => f.id === update.id)?.type || 'text',
        })));

      if (error) throw error;

      setFields(reorderedFields);
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

  useEffect(() => {
    loadFields();
  }, []);

  return {
    fields,
    addField: handleAddField,
    updateField: handleUpdateField,
    deleteField: handleDeleteField,
    reorderFields: handleReorderFields,
  };
};