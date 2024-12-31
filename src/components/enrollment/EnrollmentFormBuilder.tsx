import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormField } from "@/types/form";
import { AddFieldDialog } from "./EnrollmentAddFieldDialog";
import { FormPreview } from "./EnrollmentFormPreview";
import { useToast } from "@/hooks/use-toast";

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
  const [fields, setFields] = useState<FormField[]>(DEFAULT_FIELDS);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<FormField | undefined>();
  const [deletedFields, setDeletedFields] = useState<string[]>([]);

  useEffect(() => {
    const loadFields = () => {
      try {
        const savedFields = localStorage.getItem(ENROLLMENT_FIELDS_KEY);
        const savedDeletedFields = localStorage.getItem('deletedFields');
        
        if (savedDeletedFields) {
          setDeletedFields(JSON.parse(savedDeletedFields));
        }

        if (savedFields) {
          const parsedFields = JSON.parse(savedFields);
          // Filtrar campos duplicados, campos excluídos e campos ocultos
          const uniqueFields = parsedFields.filter((field: FormField, index: number, self: FormField[]) => {
            const isNotDeleted = !deletedFields.includes(field.id);
            const isNotHidden = !HIDDEN_FIELDS.includes(field.name);
            const isFirstOccurrence = index === self.findIndex((f) => f.name === field.name);
            return isNotDeleted && isNotHidden && isFirstOccurrence;
          });
          
          // Garantir que os campos padrão estejam presentes
          DEFAULT_FIELDS.forEach(defaultField => {
            const fieldExists = uniqueFields.some(field => field.name === defaultField.name);
            if (!fieldExists) {
              uniqueFields.unshift(defaultField);
            }
          });

          // Ordenar campos baseado na propriedade order
          const sortedFields = uniqueFields.sort((a, b) => a.order - b.order);
          setFields(sortedFields);
        }
      } catch (error) {
        console.error("Erro ao carregar campos do construtor:", error);
        setFields(DEFAULT_FIELDS);
      }
    };

    loadFields();
  }, [deletedFields]);

  useEffect(() => {
    try {
      // Salvar apenas se os campos forem diferentes dos padrão
      if (JSON.stringify(fields) !== JSON.stringify(DEFAULT_FIELDS)) {
        localStorage.setItem(ENROLLMENT_FIELDS_KEY, JSON.stringify(fields));
      }
      localStorage.setItem('deletedFields', JSON.stringify(deletedFields));
      window.dispatchEvent(new Event('formFieldsUpdated'));
    } catch (error) {
      console.error("Erro ao salvar campos do construtor:", error);
    }
  }, [fields, deletedFields]);

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
    if (DEFAULT_FIELDS.some(field => field.id === id)) {
      toast({
        title: "Operação não permitida",
        description: "Este campo é obrigatório e não pode ser removido.",
        variant: "destructive",
      });
      return;
    }

    const updatedFields = fields.filter((field) => field.id !== id);
    setFields(updatedFields);
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

  const handleReorderFields = (reorderedFields: FormField[]) => {
    setFields(reorderedFields);
    toast({
      title: "Ordem atualizada",
      description: "A ordem dos campos foi atualizada com sucesso.",
    });
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
