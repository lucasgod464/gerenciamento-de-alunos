import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormField } from "@/types/form";
import { AddFieldDialog } from "./EnrollmentAddFieldDialog";
import { FormPreview } from "./EnrollmentFormPreview";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

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
  useEffect(() => {
    const loadFields = async () => {
      if (!currentUser?.companyId) return;

      const { data, error } = await supabase
        .from('enrollment_form_fields')
        .select('*')
        .eq('company_id', currentUser.companyId)
        .order('order');

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar campos do formulário",
          variant: "destructive"
        });
        return;
      }

      const fieldsWithDefaults = [...DEFAULT_FIELDS];
      data.forEach(field => {
        if (!DEFAULT_FIELDS.some(def => def.name === field.name)) {
          fieldsWithDefaults.push(field);
        }
      });

      setFields(fieldsWithDefaults);
    };

    loadFields();
  }, [currentUser]);

  // Salvar campos no Supabase
  const handleAddField = async (field: Omit<FormField, "id" | "order">) => {
    if (!currentUser?.companyId) return;

    try {
      const { data, error } = await supabase
        .from('enrollment_form_fields')
        .insert([{
          ...field,
          company_id: currentUser.companyId,
          order: fields.length
        }])
        .select()
        .single();

      if (error) throw error;

      setFields(prev => [...prev, data]);
      toast({
        title: "Campo adicionado",
        description: "O novo campo foi adicionado com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar campo",
        variant: "destructive"
      });
    }
  };

  const handleDeleteField = (id: string) => {
    if (DEFAULT_FIELDS.some(field => field.id === id)) {
      toast({
        title: "Operação não permitida",
        description: "Este campo é obrigatório e não pode ser removido.",
        variant: "destructive",
      });
      return;
    }

    setFields(prev => prev.filter(field => field.id !== id));
    setDeletedFields(prev => [...prev, id]);
    
    toast({
      title: "Campo removido",
      description: "O campo foi removido com sucesso.",
    });
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
    if (!currentUser?.companyId) return;

    try {
      const updates = reorderedFields.map((field, index) => ({
        id: field.id,
        order: index
      }));

      const { error } = await supabase
        .from('enrollment_form_fields')
        .upsert(updates);

      if (error) throw error;

      setFields(reorderedFields);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao reordenar campos",
        variant: "destructive"
      });
    }
  };

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
