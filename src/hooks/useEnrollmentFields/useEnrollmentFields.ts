import { useState, useEffect } from "react";
import { FormField, mapSupabaseFormField, mapFormFieldToSupabase } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { defaultFields } from "./defaultFields";

export const useEnrollmentFields = () => {
  const [fields, setFields] = useState<FormField[]>([...defaultFields]);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadFields = async () => {
    try {
      if (!user?.companyId) {
        console.error("Nenhuma empresa encontrada");
        return;
      }

      const { data: customFields, error } = await supabase
        .from('enrollment_form_fields')
        .select('*')
        .eq('company_id', user.companyId)
        .order('order');

      if (error) throw error;

      const mappedFields = (customFields || []).map(mapSupabaseFormField);
      setFields([...defaultFields, ...mappedFields]);
    } catch (error) {
      console.error("Erro ao carregar campos:", error);
      toast({
        title: "Erro ao carregar campos",
        description: "Não foi possível carregar os campos do formulário.",
        variant: "destructive",
      });
    }
  };

  const addField = async (field: Omit<FormField, "id" | "order">) => {
    try {
      if (!user?.companyId) throw new Error("Empresa não encontrada");

      const newField = {
        ...mapFormFieldToSupabase(field as FormField),
        order: fields.length - defaultFields.length,
        company_id: user.companyId
      };

      const { data, error } = await supabase
        .from('enrollment_form_fields')
        .insert([newField])
        .select()
        .single();

      if (error) throw error;

      const mappedField = mapSupabaseFormField(data);
      setFields(prev => [...defaultFields, ...prev.filter(f => !f.isDefault), mappedField]);
    } catch (error) {
      console.error("Erro ao adicionar campo:", error);
      throw error;
    }
  };

  const updateField = async (updatedField: FormField) => {
    try {
      if (!user?.companyId) throw new Error("Empresa não encontrada");
      if (updatedField.isDefault) {
        toast({
          title: "Operação não permitida",
          description: "Não é possível editar campos padrão do formulário.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('enrollment_form_fields')
        .update({
          ...mapFormFieldToSupabase(updatedField),
          company_id: user.companyId
        })
        .eq('id', updatedField.id)
        .eq('company_id', user.companyId);

      if (error) throw error;

      setFields(prev => [
        ...defaultFields,
        ...prev.filter(f => !f.isDefault && f.id !== updatedField.id),
        updatedField
      ]);
    } catch (error) {
      console.error("Erro ao atualizar campo:", error);
      throw error;
    }
  };

  const deleteField = async (id: string) => {
    const isDefaultField = defaultFields.some(f => f.id === id);
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
        .eq('id', id)
        .eq('company_id', user?.companyId);

      if (error) throw error;

      setFields(prev => [...defaultFields, ...prev.filter(f => !f.isDefault && f.id !== id)]);
    } catch (error) {
      console.error("Erro ao deletar campo:", error);
      throw error;
    }
  };

  const reorderFields = async (reorderedFields: FormField[]) => {
    const customFields = reorderedFields.filter(field => !field.isDefault);
    
    try {
      if (!user?.companyId) throw new Error("Empresa não encontrada");

      const updates = customFields.map((field, index) => ({
        id: field.id,
        ...mapFormFieldToSupabase(field),
        order: index,
        company_id: user.companyId
      }));

      const { error } = await supabase
        .from('enrollment_form_fields')
        .upsert(updates);

      if (error) throw error;

      setFields([...defaultFields, ...customFields]);
    } catch (error) {
      console.error("Erro ao reordenar campos:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (user?.companyId) {
      loadFields();
    }
  }, [user?.companyId]);

  return {
    fields,
    addField,
    deleteField,
    updateField,
    reorderFields,
  };
};