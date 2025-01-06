import { useState, useEffect } from "react";
import { FormField, SupabaseFormField, mapSupabaseFormField, mapFormFieldToSupabase } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFormFields = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
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
      const newField = mapFormFieldToSupabase({
        ...field,
        source: 'admin',
        id: '',
        order: fields.length
      });

      const { data, error } = await supabase
        .from('admin_form_fields')
        .insert([{ ...newField, order: fields.length }])
        .select()
        .single();

      if (error) throw error;

      const mappedField = mapSupabaseFormField(data as SupabaseFormField);
      setFields(prev => [...prev, mappedField]);
      setIsAddingField(false);
      
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

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setIsAddingField(true);
  };

  const handleUpdateField = async (field: FormField) => {
    try {
      const { error } = await supabase
        .from('admin_form_fields')
        .update(mapFormFieldToSupabase(field))
        .eq('id', field.id);

      if (error) throw error;

      setFields(prev => prev.map(f => f.id === field.id ? field : f));
      setEditingField(null);
      setIsAddingField(false);

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

  const handleDeleteField = async (id: string) => {
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

  const handleReorderFields = async (reorderedFields: FormField[]) => {
    try {
      // Atualiza a ordem dos campos no estado local
      setFields(reorderedFields);

      // Prepara os dados para atualização no banco
      const updates = reorderedFields.map((field, index) => ({
        id: field.id,
        order: index
      }));

      // Atualiza cada campo no banco de dados
      for (const update of updates) {
        const { error } = await supabase
          .from('admin_form_fields')
          .update({ order: update.order })
          .eq('id', update.id);

        if (error) throw error;
      }

      toast({
        title: "Campos reordenados",
        description: "A ordem dos campos foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error("Error reordering fields:", error);
      toast({
        title: "Erro ao reordenar campos",
        description: "Não foi possível atualizar a ordem dos campos.",
        variant: "destructive",
      });
      // Recarrega os campos para garantir consistência
      await loadFields();
    }
  };

  useEffect(() => {
    loadFields();
  }, []);

  return {
    fields,
    isAddingField,
    editingField,
    setIsAddingField,
    setEditingField,
    handleAddField,
    handleEditField,
    handleUpdateField,
    handleDeleteField,
    handleReorderFields,
  };
};