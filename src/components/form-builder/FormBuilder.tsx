import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormField } from "@/types/form";
import { AddFieldDialog } from "./AddFieldDialog";
import { FormPreview } from "./FormPreview";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const FormBuilder = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const defaultFields: FormField[] = [
    {
      id: "nome_completo",
      name: "nome_completo",
      label: "Nome Completo",
      type: "text",
      required: true,
      order: 0,
    },
    {
      id: "data_nascimento",
      name: "data_nascimento",
      label: "Data de Nascimento",
      type: "date",
      required: true,
      order: 1,
    },
    {
      id: "sala",
      name: "sala",
      label: "Sala",
      type: "select",
      required: true,
      order: 2,
    },
    {
      id: "status",
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      order: 3,
      options: ["Ativo", "Inativo"]
    }
  ];

  const [fields, setFields] = useState<FormField[]>(defaultFields);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      const { data: customFields, error } = await supabase
        .from('admin_form_fields')
        .select('*')
        .order('order');

      if (error) throw error;

      const mergedFields = defaultFields.concat(
        customFields.map((field: any) => ({
          id: field.id,
          name: field.name,
          label: field.label,
          type: field.type,
          description: field.description,
          required: field.required,
          order: field.order,
          options: field.options,
        }))
      );

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
    try {
      const newField = {
        ...field,
        order: fields.length,
      };

      const { data, error } = await supabase
        .from('admin_form_fields')
        .insert([newField])
        .select()
        .single();

      if (error) throw error;

      const updatedFields = [...fields, { ...data, id: data.id }];
      setFields(updatedFields);
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

  const handleEditField = (field: FormField) => {
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
  };

  const handleUpdateField = async (updatedField: Omit<FormField, "id" | "order">) => {
    if (!editingField) return;

    try {
      const { error } = await supabase
        .from('admin_form_fields')
        .update({
          ...updatedField,
          order: editingField.order,
        })
        .eq('id', editingField.id);

      if (error) throw error;

      const updatedFields = fields.map(field => 
        field.id === editingField.id 
          ? { ...updatedField, id: field.id, order: field.order }
          : field
      );

      setFields(updatedFields);
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

      setFields(prevFields => prevFields.filter(field => field.id !== id));
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
        order: defaultFields.length + index,
      }));

      const { error } = await supabase
        .from('admin_form_fields')
        .upsert(updates);

      if (error) throw error;

      const updatedFields = reorderedFields.map((field, index) => ({
        ...field,
        order: index,
      }));

      setFields(updatedFields);
    } catch (error) {
      console.error("Error reordering fields:", error);
      toast({
        title: "Erro ao reordenar campos",
        description: "Não foi possível reordenar os campos.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Campos do Formulário</h2>
          <Button onClick={() => {
            setEditingField(null);
            setIsAddingField(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Campo
          </Button>
        </div>
        <FormPreview 
          fields={fields} 
          onDeleteField={handleDeleteField}
          onEditField={handleEditField}
          onReorderFields={handleReorderFields}
        />
      </Card>

      <AddFieldDialog
        open={isAddingField}
        onClose={() => {
          setIsAddingField(false);
          setEditingField(null);
        }}
        onAddField={editingField ? handleUpdateField : handleAddField}
        editingField={editingField}
      />
    </div>
  );
};