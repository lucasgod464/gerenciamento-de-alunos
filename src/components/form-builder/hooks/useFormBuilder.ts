import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormField, SupabaseFormField, mapSupabaseFormField } from "../types";
import { defaultFields } from "./useDefaultFields";
import { useFormOperations } from "./useFormOperations";

export const useFormBuilder = () => {
  const { toast } = useToast();
  const [fields, setFields] = useState<FormField[]>(defaultFields);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const operations = useFormOperations();

  const loadFields = async () => {
    try {
      const { data: customFields, error } = await supabase
        .from('admin_form_fields')
        .select('*')
        .order('order');

      if (error) throw error;

      const mappedCustomFields = (customFields || []).map(mapSupabaseFormField);
      const mergedFields = [...defaultFields, ...mappedCustomFields];
      
      setFields(mergedFields);
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
    const newField = await operations.addField(field, fields.length);
    setFields(prev => [...prev, newField]);
    setIsAddingField(false);
  };

  const handleUpdateField = async (field: FormField) => {
    if (!editingField) return;
    
    const updatedField = await operations.updateField({
      ...field,
      id: editingField.id,
      order: editingField.order,
    });

    setFields(prev => prev.map(f => 
      f.id === editingField.id ? updatedField : f
    ));
    setEditingField(null);
    setIsAddingField(false);
  };

  const handleDeleteField = async (id: string) => {
    const defaultFieldIds = defaultFields.map(field => field.id);
    if (defaultFieldIds.includes(id)) {
      toast({
        title: "Operação não permitida",
        description: "Não é possível excluir campos padrão do formulário.",
        variant: "destructive",
      });
      return;
    }

    await operations.deleteField(id);
    setFields(prev => prev.filter(field => field.id !== id));
  };

  const handleReorderFields = async (reorderedFields: FormField[]) => {
    const updatedFields = await operations.reorderFields(reorderedFields);
    setFields(updatedFields);
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
      const defaultFieldIds = defaultFields.map(f => f.id);
      if (defaultFieldIds.includes(field.id)) {
        toast({
          title: "Operação não permitida",
          description: "Não é possível editar campos padrão do formulário.",
          variant: "destructive",
        });
        return;
      }
      setEditingField(field);
      setIsAddingField(true);
    },
    handleUpdateField,
    handleDeleteField,
    handleReorderFields,
  };
};