import { useState, useEffect } from "react";
import { FormField, SupabaseFormField, mapSupabaseFormField } from "@/types/form";
import { AddFieldDialog } from "./EnrollmentAddFieldDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EnrollmentFormHeader } from "./EnrollmentFormHeader";
import { EnrollmentFormConfig } from "./EnrollmentFormConfig";

const DEFAULT_FIELDS: FormField[] = [
  {
    id: "default-name",
    name: "nome_completo",
    label: "Nome Completo",
    type: "text",
    required: true,
    order: 0,
  },
  {
    id: "default-birthdate",
    name: "data_nascimento",
    label: "Data de Nascimento",
    type: "date",
    required: true,
    order: 1,
  }
];

const HIDDEN_FIELDS = ["sala", "status"];

export const EnrollmentFormBuilder = () => {
  const { toast } = useToast();
  const [fields, setFields] = useState<FormField[]>([]);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<FormField | undefined>();
  const [deletedFields, setDeletedFields] = useState<string[]>([]);

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      const { data: formFields, error } = await supabase
        .from('enrollment_form_fields')
        .select('*')
        .order('order');

      if (error) throw error;

      const validatedFields = (formFields || [])
        .map((field: SupabaseFormField) => mapSupabaseFormField(field))
        .filter(field => 
          !deletedFields.includes(field.id) && 
          !HIDDEN_FIELDS.includes(field.name)
        );
      
      const fieldsWithDefaults = [...DEFAULT_FIELDS];
      validatedFields.forEach(field => {
        if (!DEFAULT_FIELDS.some(def => def.name === field.name)) {
          fieldsWithDefaults.push(field);
        }
      });

      setFields(fieldsWithDefaults.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error("Error loading form builder fields:", error);
      toast({
        title: "Erro ao carregar campos",
        description: "Não foi possível carregar os campos do formulário.",
        variant: "destructive",
      });
    }
  };

  const handleAddField = async (field: Omit<FormField, "id" | "order">) => {
    try {
      if (editingField) {
        const { error } = await supabase
          .from('enrollment_form_fields')
          .update({
            name: field.name,
            label: field.label,
            type: field.type,
            description: field.description,
            required: field.required,
            options: field.options
          })
          .eq('id', editingField.id);

        if (error) throw error;

        setFields(prev => prev.map(f =>
          f.id === editingField.id ? { ...f, ...field } : f
        ));
        
        setEditingField(undefined);
        toast({
          title: "Campo atualizado",
          description: "O campo foi atualizado com sucesso.",
        });
      } else {
        const { data, error } = await supabase
          .from('enrollment_form_fields')
          .insert({
            ...field,
            order: fields.length,
          })
          .select()
          .single();

        if (error) throw error;

        const newField = mapSupabaseFormField(data as SupabaseFormField);
        setFields(prev => [...prev, newField]);
        toast({
          title: "Campo adicionado",
          description: "O novo campo foi adicionado com sucesso.",
        });
      }
    } catch (error) {
      console.error("Error saving form field:", error);
      toast({
        title: "Erro ao salvar campo",
        description: "Não foi possível salvar o campo do formulário.",
        variant: "destructive",
      });
    }
    setIsAddingField(false);
  };

  const handleDeleteField = async (id: string) => {
    if (DEFAULT_FIELDS.some(field => field.id === id)) {
      toast({
        title: "Operação não permitida",
        description: "Este campo é obrigatório e não pode ser removido.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('enrollment_form_fields')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFields(prev => prev.filter(field => field.id !== id));
      setDeletedFields(prev => [...prev, id]);
      
      toast({
        title: "Campo removido",
        description: "O campo foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting form field:", error);
      toast({
        title: "Erro ao remover campo",
        description: "Não foi possível remover o campo do formulário.",
        variant: "destructive",
      });
    }
  };

  const handleEditField = (field: FormField) => {
    if (DEFAULT_FIELDS.some(defaultField => defaultField.id === field.id)) {
      toast({
        title: "Operação não permitida",
        description: "Este campo é obrigatório e não pode ser editado.",
        variant: "destructive",
      });
      return;
    }

    setEditingField(field);
    setIsAddingField(true);
  };

  const handleReorderFields = async (reorderedFields: FormField[]) => {
    const updatedFields = reorderedFields.map((field, index) => ({
      ...field,
      order: index,
    }));

    try {
      const updatePromises = updatedFields
        .filter(field => !DEFAULT_FIELDS.some(def => def.id === field.id))
        .map(field => 
          supabase
            .from('enrollment_form_fields')
            .update({ order: field.order })
            .eq('id', field.id)
        );

      await Promise.all(updatePromises);
      setFields(updatedFields);
    } catch (error) {
      console.error("Error reordering fields:", error);
      toast({
        title: "Erro ao reordenar campos",
        description: "Não foi possível atualizar a ordem dos campos.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <EnrollmentFormHeader />
      <EnrollmentFormConfig 
        fields={fields}
        onAddField={() => {
          setEditingField(undefined);
          setIsAddingField(true);
        }}
        onDeleteField={handleDeleteField}
        onEditField={handleEditField}
        onReorderFields={handleReorderFields}
      />

      <AddFieldDialog
        open={isAddingField}
        onClose={() => {
          setIsAddingField(false);
          setEditingField(undefined);
        }}
        onAddField={handleAddField}
        editingField={editingField}
      />
    </div>
  );
};