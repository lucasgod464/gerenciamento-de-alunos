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

interface EnrollmentFormBuilderProps {
  onSave: (formFields: any) => Promise<void>;
  loadConfig: () => Promise<any>;
  isLoading: boolean;
}

export const EnrollmentFormBuilder: React.FC<EnrollmentFormBuilderProps> = ({
  onSave,
  loadConfig,
  isLoading
}) => {
  const { toast } = useToast();
  const [fields, setFields] = useState<FormField[]>([]);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<FormField | undefined>();
  const [deletedFields, setDeletedFields] = useState<string[]>([]);

  // Load fields from localStorage on component mount
  useEffect(() => {
    try {
      const savedFields = localStorage.getItem(ENROLLMENT_FIELDS_KEY);
      const savedDeletedFields = localStorage.getItem('deletedFields');
      
      if (savedDeletedFields) {
        setDeletedFields(JSON.parse(savedDeletedFields));
      }

      if (savedFields) {
        const parsedFields = JSON.parse(savedFields);
        const uniqueFields = parsedFields.filter((field: FormField) => {
          return !deletedFields.includes(field.id) && 
                 !HIDDEN_FIELDS.includes(field.name);
        });
        
        // Ensure default fields are present
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
  }, []);

  // Save fields to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(ENROLLMENT_FIELDS_KEY, JSON.stringify(fields));
      localStorage.setItem('deletedFields', JSON.stringify(deletedFields));
      window.dispatchEvent(new Event('formFieldsUpdated'));
    } catch (error) {
      console.error("Error saving form builder fields:", error);
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

  const handleReorderFields = (reorderedFields: FormField[]) => {
    const updatedFields = reorderedFields.map((field, index) => ({
      ...field,
      order: index,
    }));
    setFields(updatedFields);
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
