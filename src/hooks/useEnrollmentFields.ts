import { useState, useEffect } from "react";
import { FormField, SupabaseFormField, mapSupabaseFormField } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useEnrollmentFields = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const { toast } = useToast();

  const loadFields = async () => {
    try {
      const { data: formFields, error } = await supabase
        .from('enrollment_form_fields')
        .select('*')
        .order('order');

      if (error) throw error;

      const mappedFields = (formFields || []).map((field: SupabaseFormField) => mapSupabaseFormField(field));
      setFields(mappedFields);
    } catch (error) {
      console.error("Error loading enrollment fields:", error);
      toast({
        title: "Erro ao carregar campos",
        description: "Não foi possível carregar os campos do formulário.",
        variant: "destructive",
      });
    }
  };

  const handleAddField = async (field: Omit<FormField, "id" | "order">) => {
    try {
      const { data, error } = await supabase
        .from('enrollment_form_fields')
        .insert([{
          name: field.name,
          label: field.label,
          type: field.type,
          description: field.description || null,
          required: field.required || false,
          options: field.options || null,
          order: fields.length
        }])
        .select()
        .single();

      if (error) throw error;

      const newField = mapSupabaseFormField(data as SupabaseFormField);
      setFields(prev => [...prev, newField]);
      
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

  const handleDeleteField = async (id: string) => {
    try {
      const { error } = await supabase
        .from('enrollment_form_fields')
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

  const handleUpdateField = async (updatedField: FormField) => {
    try {
      const { error } = await supabase
        .from('enrollment_form_fields')
        .update({
          name: updatedField.name,
          label: updatedField.label,
          type: updatedField.type,
          description: updatedField.description,
          required: updatedField.required,
          options: updatedField.options
        })
        .eq('id', updatedField.id);

      if (error) throw error;

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

  const handleReorderFields = async (reorderedFields: FormField[]) => {
    try {
      const updates = reorderedFields.map((field, index) => ({
        id: field.id,
        order: index
      }));

      const { error } = await supabase
        .from('enrollment_form_fields')
        .upsert(updates);

      if (error) throw error;

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
    loadFields();
  }, []);

  return {
    fields,
    addField: handleAddField,
    deleteField: handleDeleteField,
    updateField: handleUpdateField,
    reorderFields: handleReorderFields,
  };
};