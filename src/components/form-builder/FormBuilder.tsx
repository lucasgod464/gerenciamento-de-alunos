import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormField } from "@/types/form";
import { AddFieldDialog } from "./AddFieldDialog";
import { FormPreview } from "./FormPreview";
import { useToast } from "@/hooks/use-toast";

const ENROLLMENT_FIELDS_KEY = "enrollmentFields";

export const FormBuilder = () => {
  const { toast } = useToast();
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
      id: "batizado",
      name: "batizado",
      label: "Batizado",
      type: "select",
      required: true,
      order: 2,
      options: ["Sim", "Não"]
    }
  ];

  const [fields, setFields] = useState<FormField[]>(defaultFields);
  const [isAddingField, setIsAddingField] = useState(false);

  useEffect(() => {
    const loadFields = () => {
      try {
        const savedFields = localStorage.getItem(ENROLLMENT_FIELDS_KEY);
        if (savedFields) {
          const parsedFields = JSON.parse(savedFields);
          const mergedFields = defaultFields.concat(
            parsedFields.filter((field: FormField) => 
              !defaultFields.some(defaultField => defaultField.id === field.id)
            )
          );
          setFields(mergedFields);
        } else {
          setFields(defaultFields);
          localStorage.setItem(ENROLLMENT_FIELDS_KEY, JSON.stringify(defaultFields));
        }
      } catch (error) {
        console.error("Error loading form fields:", error);
        setFields(defaultFields);
      }
    };

    loadFields();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(ENROLLMENT_FIELDS_KEY, JSON.stringify(fields));
      window.dispatchEvent(new Event('formFieldsUpdated'));
    } catch (error) {
      console.error("Error saving form fields:", error);
    }
  }, [fields]);

  const handleAddField = (field: Omit<FormField, "id" | "order">) => {
    const newField: FormField = {
      ...field,
      id: Math.random().toString(36).substr(2, 9),
      order: fields.length,
    };
    
    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    setIsAddingField(false);
    
    toast({
      title: "Campo adicionado",
      description: "O novo campo foi adicionado com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Campos do Formulário</h2>
          <Button onClick={() => setIsAddingField(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Campo
          </Button>
        </div>
        <FormPreview fields={fields} />
      </Card>

      <AddFieldDialog
        open={isAddingField}
        onClose={() => setIsAddingField(false)}
        onAddField={handleAddField}
      />
    </div>
  );
};