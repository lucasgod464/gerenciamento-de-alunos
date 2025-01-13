import { useState, useEffect } from "react";
import { FormField } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCompanyId } from "@/components/form-builder/hooks/useCompanyId";
import { mapSupabaseFormField, mapFormFieldToSupabase } from "@/types/form";

export const useFormFields = () => {
  const { toast } = useToast();
  const [fields, setFields] = useState<FormField[]>([]);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
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

      const mappedFields = (customFields || []).map(mapSupabaseFormField);
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

      const supabaseField = mapFormFieldToSupabase(field as FormField);
      const newField = {
        ...supabaseField,
        order: fields.length,
        company_id: companyId,
      };

      const { data, error } = await supabase
        .from('admin_form_fields')
        .insert([newField])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const mappedField = mapSupabaseFormField(data);
        setFields(prev => [...prev, mappedField]);
        setIsAddingField(false);
        
        toast({
          title: "Campo adicionado",
          description: "O novo campo foi adicionado com sucesso.",
        });
      }
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

      const supabaseField = mapFormFieldToSupabase(field);
      const { error } = await supabase
        .from('admin_form_fields')
        .update({
          ...supabaseField,
          company_id: companyId
        })
        .eq('id', field.id)
        .eq('company_id', companyId);

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

  const handleReorderFields = async (reorderedFields: FormField[]) => {
    try {
      if (!companyId) {
        toast({
          title: "Erro ao reordenar campos",
          description: "ID da empresa não encontrado.",
          variant: "destructive",
        });
        return;
      }

      const updates = reorderedFields.map((field, index) => ({
        id: field.id,
        name: field.name,
        label: field.label,
        type: field.type,
        order: index,
        company_id: companyId
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

  const handleDeleteField = async (id: string) => {
    try {
      if (!companyId) {
        toast({
          title: "Erro ao remover campo",
          description: "ID da empresa não encontrado.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('admin_form_fields')
        .delete()
        .eq('id', id)
        .eq('company_id', companyId);

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
    handleReorderFields,
  };
};
