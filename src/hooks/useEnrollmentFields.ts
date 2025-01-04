import { useState, useEffect } from "react";
import { FormField, mapSupabaseFormField, mapFormFieldToSupabase } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const defaultFields: FormField[] = [
  {
    id: "nome_completo",
    name: "nome_completo",
    label: "Nome Completo",
    type: "text",
    required: true,
    order: 0,
    isDefault: true
  },
  {
    id: "data_nascimento",
    name: "data_nascimento",
    label: "Data de Nascimento",
    type: "date",
    required: true,
    order: 1,
    isDefault: true
  },
  {
    id: "sala",
    name: "sala",
    label: "Sala",
    type: "select",
    required: true,
    order: 2,
    isDefault: true
  },
  {
    id: "status",
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    order: 3,
    options: ["Ativo", "Inativo"],
    isDefault: true
  }
];

export const useEnrollmentFields = () => {
  const [fields, setFields] = useState<FormField[]>(defaultFields);
  const { toast } = useToast();

  const loadFields = async () => {
    try {
      const { data: customFields, error } = await supabase
        .from('enrollment_form_fields')
        .select('*')
        .order('order');

      if (error) throw error;

      const mappedCustomFields = (customFields || []).map(mapSupabaseFormField);
      const mergedFields = [...defaultFields, ...mappedCustomFields];
      
      setFields(mergedFields);
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
      const newField = {
        ...mapFormFieldToSupabase(field as FormField),
        order: fields.length,
      };

      const { data, error } = await supabase
        .from('enrollment_form_fields')
        .insert([newField])
        .select()
        .single();

      if (error) throw error;

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
      const { error } = await supabase
        .from('enrollment_form_fields')
        .update(mapFormFieldToSupabase(updatedField))
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

  const reorderFields = async (reorderedFields: FormField[]) => {
    const customFields = reorderedFields.filter(field => !defaultFields.some(df => df.id === field.id));
    
    try {
      const updates = customFields.map((field, index) => ({
        id: field.id,
        ...mapFormFieldToSupabase(field),
        order: defaultFields.length + index
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
    addField,
    deleteField,
    updateField,
    reorderFields,
  };
};