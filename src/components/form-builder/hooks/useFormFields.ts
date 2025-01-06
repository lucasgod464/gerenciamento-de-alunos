import { useState, useEffect } from "react";
import { FormField } from "@/types/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useFormOperations } from "./useFormOperations";

export const useFormFields = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const { toast } = useToast();
  const { loadFields, addField, updateField, deleteField } = useFormOperations();

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const loadedFields = await loadFields();
        setFields(loadedFields);
      } catch (error) {
        console.error("Error loading fields:", error);
        toast({
          title: "Erro ao carregar campos",
          description: "Não foi possível carregar os campos do formulário.",
          variant: "destructive",
        });
      }
    };

    fetchFields();
  }, []);

  const handleAddField = async (field: Omit<FormField, "id" | "order">) => {
    try {
      const newField = await addField(field, fields.length);
      setFields(prev => [...prev, newField]);
      setIsAddingField(false);
      
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

  const handleUpdateField = async (field: FormField) => {
    if (!editingField) return;

    try {
      const updatedField = await updateField(field, editingField);
      setFields(prev => prev.map(f => f.id === editingField.id ? updatedField : f));
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
      await deleteField(id);
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

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setIsAddingField(true);
  };

  const handleReorderFields = async (reorderedFields: FormField[]) => {
    try {
      const updates = reorderedFields.map((field, index) => ({
        ...field,
        order: index,
      }));

      const { error } = await supabase
        .from('admin_form_fields')
        .upsert(updates.map(field => ({
          id: field.id,
          order: field.order,
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
    }
  };

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