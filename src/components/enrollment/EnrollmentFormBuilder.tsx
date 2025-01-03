import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormField } from "@/types/form";
import { AddFieldDialog } from "./EnrollmentAddFieldDialog";
import { FormPreview } from "./EnrollmentFormPreview";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const ENROLLMENT_FIELDS_KEY = "enrollmentFields";

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
  const { user: currentUser } = useAuth();
  const [fields, setFields] = useState<FormField[]>([]);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<FormField | undefined>();
  const [deletedFields, setDeletedFields] = useState<string[]>([]);

  // Carregar campos do Supabase
  const fetchFields = async () => {
    if (!currentUser?.companyId) return;

    try {
      const { data, error } = await supabase
        .from('enrollment_forms')
        .select('form_data')
        .eq('company_id', currentUser.companyId)
        .single();

      if (error) throw error;

      if (data?.form_data?.fields) {
        const savedFields = data.form_data.fields;
        const uniqueFields = savedFields.filter((field: FormField) => {
          return !deletedFields.includes(field.id) && 
                 !HIDDEN_FIELDS.includes(field.name);
        });
        
        // Garantir que os campos padrão estejam presentes
        const fieldsWithDefaults = [...DEFAULT_FIELDS];
        uniqueFields.forEach(field => {
          if (!DEFAULT_FIELDS.some(def => def.name === field.name)) {
            fieldsWithDefaults.push(field);
          }
        });

        setFields(fieldsWithDefaults.sort((a, b) => a.order - b.order));
      } else {
        setFields(DEFAULT_FIELDS);
      }
    } catch (error) {
      console.error("Error loading form builder fields:", error);
      setFields(DEFAULT_FIELDS);
    }
  };

  useEffect(() => {
    fetchFields();
  }, [currentUser]);

  // Salvar campos no Supabase
  const saveFields = async (updatedFields: FormField[]) => {
    if (!currentUser?.companyId) return;

    try {
      const { error } = await supabase
        .from('enrollment_forms')
        .upsert({
          company_id: currentUser.companyId,
          form_data: { 
            fields: updatedFields,
            deletedFields: deletedFields
          },
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      window.dispatchEvent(new Event('formFieldsUpdated'));
    } catch (error) {
      console.error("Error saving form builder fields:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações do formulário.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (fields.length > 0) {
      saveFields(fields);
    }
  }, [fields, deletedFields]);

  // Resto do código permanece igual
  const handleAddField = (field: Omit<FormField, "id" | "order">) => {
    if (editingField) {
      const updatedFields = fields.map((f) =>
        f.id === editingField.id ? { ...f, ...field } : f
      );
      setFields(updatedFields);
      setEditingField(undefined);
      toast({
        title: "Campo atualizado",
        description: "O campo foi atualizado com sucesso.",
      });
    } else {
      const newField: FormField = {
        ...field,
        id: crypto.randomUUID(),
        order: fields.length,
      };
      
      setFields(prev => [...prev, newField]);
      toast({
        title: "Campo adicionado",
        description: "O novo campo foi adicionado com sucesso.",
      });
    }
    setIsAddingField(false);
  };

  // ... resto do código permanece igual ...

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Campos do Formulário de Inscrição</h2>
          <Button onClick={() => {
            setEditingField(undefined);
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
          setEditingField(undefined);
        }}
        onAddField={handleAddField}
        editingField={editingField}
      />
    </div>
  );
};
