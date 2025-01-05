import { useState, useEffect } from "react";
import { FormField, mapSupabaseFormField, mapFormFieldToSupabase } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useEnrollmentFields = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadFields = async () => {
    try {
      console.log('Loading fields for company:', user?.companyId);
      
      const { data: customFields, error } = await supabase
        .from('enrollment_form_fields')
        .select('*')
        .eq('company_id', user?.companyId)
        .order('order');

      if (error) throw error;

      const mappedCustomFields = (customFields || []).map(mapSupabaseFormField);
      setFields(mappedCustomFields);
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
    if (!user?.companyId) {
      toast({
        title: "Erro",
        description: "Usuário não está vinculado a uma empresa",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Adding field with company_id:', user.companyId);
      
      const newField = {
        ...mapFormFieldToSupabase(field as FormField),
        order: fields.length,
        company_id: user.companyId
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

  const updateField = async (updatedField: FormField) => {
    if (!user?.companyId) {
      toast({
        title: "Erro",
        description: "Usuário não está vinculado a uma empresa",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Updating field:', updatedField.id, 'for company:', user.companyId);
      
      const { error } = await supabase
        .from('enrollment_form_fields')
        .update({
          ...mapFormFieldToSupabase(updatedField),
          company_id: user.companyId
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

  const deleteField = async (id: string) => {
    try {
      console.log('Deleting field:', id);
      
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

  const reorderFields = async (reorderedFields: FormField[]) => {
    if (!user?.companyId) {
      toast({
        title: "Erro",
        description: "Usuário não está vinculado a uma empresa",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Reordering fields for company:', user.companyId);
      
      const updates = reorderedFields.map((field, index) => ({
        id: field.id,
        ...mapFormFieldToSupabase(field),
        order: index,
        company_id: user.companyId
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