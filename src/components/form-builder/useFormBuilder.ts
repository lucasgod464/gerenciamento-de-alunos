import { useState, useEffect } from "react";
import { FormField, SupabaseFormField, mapSupabaseFormField, mapFormFieldToSupabase } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const defaultFields: FormField[] = [
  {
    id: "nome_completo",
    name: "nome_completo",
    label: "Nome Completo",
    type: "text",
    required: true,
    order: 0,
    isDefault: true,
  },
  {
    id: "data_nascimento",
    name: "data_nascimento",
    label: "Data de Nascimento",
    type: "date",
    required: true,
    order: 1,
    isDefault: true,
  },
  {
    id: "sala",
    name: "sala",
    label: "Sala",
    type: "select",
    required: true,
    order: 2,
    isDefault: true,
  },
  {
    id: "status",
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    order: 3,
    options: ["Ativo", "Inativo"],
    isDefault: true,
  }
];

export const useFormBuilder = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [fields, setFields] = useState<FormField[]>(defaultFields);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);

  const loadFields = async () => {
    try {
      const { data: customFields, error } = await supabase
        .from('admin_form_fields')
        .select('*')
        .order('order');

      if (error) throw error;

      const mappedFields = (customFields || []).map(mapSupabaseFormField);
      setFields([...defaultFields, ...mappedFields]);
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
      if (!user?.companyId) {
        throw new Error("Usuário não está vinculado a uma empresa");
      }

      const supabaseField = mapFormFieldToSupabase(field);
      const newField = {
        ...supabaseField,
        company_id: user.companyId,
        order: fields.length,
      };

      const { data, error } = await supabase
        .from('admin_form_fields')
        .insert([newField])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const mappedField = mapSupabaseFormField(data[0]);
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
    if (!editingField) return;

    try {
      const supabaseField = mapFormFieldToSupabase(field);
      const { error } = await supabase
        .from('admin_form_fields')
        .update({
          ...supabaseField,
          order: editingField.order,
          company_id: user?.companyId,
        })
        .eq('id', editingField.id);

      if (error) throw error;

      setFields(prev => prev.map(f => 
        f.id === editingField.id 
          ? { ...field, id: editingField.id, order: editingField.order }
          : f
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
    const defaultFieldIds = defaultFields.map(field => field.id);
    if (defaultFieldIds.includes(id)) {
      toast({
        title: "Operação não permitida",
        description: "Não é possível excluir campos padrão do formulário.",
        variant: "destructive",
      });
      return;
    }

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
      const customFields = reorderedFields.filter(field => !defaultFields.map(f => f.id).includes(field.id));
      
      const updates = customFields.map((field, index) => ({
        id: field.id,
        name: field.name,
        label: field.label,
        type: field.type,
        order: defaultFields.length + index,
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