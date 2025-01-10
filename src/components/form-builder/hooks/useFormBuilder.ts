import { useState, useEffect } from "react";
import { FormField } from "@/types/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useFieldOperations } from "./useFieldOperations";
import { useCompanyId } from "./useCompanyId";

export const useFormBuilder = () => {
  const { toast } = useToast();
  const [fields, setFields] = useState<FormField[]>([]);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const { addField, updateField, deleteField } = useFieldOperations();
  const companyId = useCompanyId();

  const loadFields = async () => {
    try {
      if (!companyId) {
        console.error("Company ID not found");
        return;
      }

      const { data: customFields, error } = await supabase
        .from('admin_form_fields')
        .select('*')
        .eq('company_id', companyId)
        .order('order');

      if (error) throw error;

      const mappedFields = customFields.map(field => ({
        id: field.id,
        name: field.name,
        label: field.label,
        type: field.type as FormField['type'],
        description: field.description || "",
        required: field.required || false,
        order: field.order,
        options: Array.isArray(field.options) ? field.options : undefined,
        source: 'admin' as const
      }));

      setFields(mappedFields);
    } catch (error) {
      console.error("Error loading fields:", error);
      toast({
        title: "Erro ao carregar campos",
        description: "Não foi possível carregar os campos do formulário.",
        variant: "destructive",
      });
    }
  };

  const handleAddField = async (field: Omit<FormField, "id" | "order">) => {
    try {
      if (!companyId) {
        toast({
          title: "Erro ao adicionar campo",
          description: "ID da empresa não encontrado.",
          variant: "destructive",
        });
        return;
      }

      const newField = await addField({ ...field, company_id: companyId }, fields.length);
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
    try {
      if (!companyId) {
        toast({
          title: "Erro ao atualizar campo",
          description: "ID da empresa não encontrado.",
          variant: "destructive",
        });
        return;
      }

      const updatedField = await updateField({ ...field, company_id: companyId });
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

  useEffect(() => {
    if (companyId) {
      loadFields();
    }
  }, [companyId]);

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