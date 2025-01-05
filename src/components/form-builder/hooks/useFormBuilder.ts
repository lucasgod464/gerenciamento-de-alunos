import { useState, useEffect } from "react";
import { FormField } from "@/types/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useFormOperations } from "./useFormOperations";

export const useFormBuilder = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const { toast } = useToast();
  const { updateField, addField, deleteField } = useFormOperations();

  const loadFields = async () => {
    try {
      const { data: customFields, error } = await supabase
        .from('admin_form_fields')
        .select('*')
        .order('order');

      if (error) throw error;

      if (customFields) {
        const mappedFields = customFields.map(field => ({
          id: field.id,
          name: field.name,
          label: field.label,
          type: field.type,
          description: field.description || "",
          required: field.required || false,
          order: field.order,
          options: Array.isArray(field.options) ? field.options : undefined,
        }));
        setFields(mappedFields);
      }
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
      const newField = await addField(field, fields.length);
      setFields(prev => [...prev, newField]);
      setIsAddingField(false);
      
      toast({
        title: "Campo adicionado",
        description: "O novo campo foi adicionado com sucesso.",
      });
    } catch (error) {
      console.error("Error adding field:", error);
    }
  };

  const handleUpdateField = async (field: FormField) => {
    try {
      const updatedField = await updateField(field);
      setFields(prev => prev.map(f => 
        f.id === field.id ? updatedField : f
      ));
      setEditingField(null);
      setIsAddingField(false);

      toast({
        title: "Campo atualizado",
        description: "O campo foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Error updating field:", error);
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
    handleEditField: (field: FormField) => {
      setEditingField(field);
      setIsAddingField(true);
    },
    handleUpdateField,
    handleDeleteField,
  };
};