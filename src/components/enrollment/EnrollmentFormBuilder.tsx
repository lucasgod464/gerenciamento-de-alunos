import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormField } from "@/types/form";
import { AddFieldDialog } from "./EnrollmentAddFieldDialog";
import { FormPreview } from "./EnrollmentFormPreview";
import { useToast } from "@/hooks/use-toast";

const ENROLLMENT_FIELDS_KEY = "enrollmentFields";

const DEFAULT_NAME_FIELD: FormField = {
  id: "default-name",
  name: "nome_completo",
  label: "Nome Completo",
  type: "text",
  required: true,
  order: 0,
};

export const EnrollmentFormBuilder = () => {
  const { toast } = useToast();
  const [fields, setFields] = useState<FormField[]>([DEFAULT_NAME_FIELD]);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<FormField | undefined>();

  // Carregar campos inicialmente
  useEffect(() => {
    const loadFields = () => {
      try {
        const savedFields = localStorage.getItem(ENROLLMENT_FIELDS_KEY);
        console.log("Carregando campos do construtor:", savedFields);
        if (savedFields) {
          const parsedFields = JSON.parse(savedFields);
          // Garantir que o campo de nome sempre esteja presente
          if (!parsedFields.some(field => field.id === "default-name")) {
            parsedFields.unshift(DEFAULT_NAME_FIELD);
          }
          setFields(parsedFields);
        } else {
          // Se não houver campos salvos, inicializar com o campo de nome
          setFields([DEFAULT_NAME_FIELD]);
          localStorage.setItem(ENROLLMENT_FIELDS_KEY, JSON.stringify([DEFAULT_NAME_FIELD]));
        }
        console.log("Campos do construtor carregados:", fields);
      } catch (error) {
        console.error("Erro ao carregar campos do construtor:", error);
        // Em caso de erro, garantir que pelo menos o campo de nome esteja presente
        setFields([DEFAULT_NAME_FIELD]);
      }
    };

    loadFields();

    // Adicionar listener para mudanças no localStorage
    const handleStorageChange = () => {
      loadFields();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('enrollmentFieldsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('enrollmentFieldsUpdated', handleStorageChange);
    };
  }, []);

  // Salvar campos quando houver mudanças
  useEffect(() => {
    try {
      console.log("Salvando campos no localStorage:", fields);
      localStorage.setItem(ENROLLMENT_FIELDS_KEY, JSON.stringify(fields));
      window.dispatchEvent(new Event('enrollmentFieldsUpdated'));
      console.log("Campos salvos com sucesso");
    } catch (error) {
      console.error("Erro ao salvar campos:", error);
    }
  }, [fields]);

  const handleAddField = (field: Omit<FormField, "id" | "order">) => {
    if (editingField) {
      // Atualizar campo existente
      const updatedFields = fields.map((f) =>
        f.id === editingField.id ? { ...field, id: f.id, order: f.order } : f
      );
      setFields(updatedFields);
      setEditingField(undefined);
      toast({
        title: "Campo atualizado",
        description: "O campo foi atualizado com sucesso.",
      });
    } else {
      // Adicionar novo campo
      const newField: FormField = {
        ...field,
        id: Math.random().toString(36).substr(2, 9),
        order: fields.length,
      };
      
      const updatedFields = [...fields, newField];
      setFields(updatedFields);
      toast({
        title: "Campo adicionado",
        description: "O novo campo foi adicionado com sucesso.",
      });
    }
    setIsAddingField(false);
  };

  const handleDeleteField = (id: string) => {
    // Não permitir a exclusão do campo de nome se for o campo padrão
    if (id === "default-name") {
      toast({
        title: "Operação não permitida",
        description: "O campo Nome Completo é obrigatório e não pode ser removido.",
        variant: "destructive",
      });
      return;
    }

    const updatedFields = fields.filter((field) => field.id !== id);
    setFields(updatedFields);
    
    toast({
      title: "Campo removido",
      description: "O campo foi removido com sucesso.",
    });
  };

  const handleEditField = (field: FormField) => {
    // Não permitir a edição do campo de nome se for o campo padrão
    if (field.id === "default-name") {
      toast({
        title: "Operação não permitida",
        description: "O campo Nome Completo é obrigatório e não pode ser editado.",
        variant: "destructive",
      });
      return;
    }

    setEditingField(field);
    setIsAddingField(true);
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