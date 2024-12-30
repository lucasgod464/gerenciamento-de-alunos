import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormField } from "@/types/form";
import { AddFieldDialog } from "./EnrollmentAddFieldDialog";
import { FormPreview } from "./EnrollmentFormPreview";
import { useToast } from "@/hooks/use-toast";

const ENROLLMENT_FIELDS_KEY = "enrollmentFields";

export const EnrollmentFormBuilder = () => {
  const { toast } = useToast();
  const [fields, setFields] = useState<FormField[]>([]);
  const [isAddingField, setIsAddingField] = useState(false);

  // Load fields from localStorage on component mount
  useEffect(() => {
    const loadFields = () => {
      try {
        const savedFields = localStorage.getItem(ENROLLMENT_FIELDS_KEY);
        if (savedFields) {
          setFields(JSON.parse(savedFields));
        }
      } catch (error) {
        console.error("Error loading enrollment form fields:", error);
        setFields([]);
      }
    };

    loadFields();
  }, []);

  // Save fields to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(ENROLLMENT_FIELDS_KEY, JSON.stringify(fields));
      console.info("Enrollment fields saved to localStorage:", fields);
    } catch (error) {
      console.error("Error saving enrollment form fields:", error);
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

  const handleDeleteField = (id: string) => {
    const updatedFields = fields.filter((field) => field.id !== id);
    setFields(updatedFields);
    
    toast({
      title: "Campo removido",
      description: "O campo foi removido com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Campos do Formulário de Inscrição</h2>
          <Button onClick={() => setIsAddingField(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Campo
          </Button>
        </div>
        <FormPreview fields={fields} onDeleteField={handleDeleteField} />
      </Card>

      <AddFieldDialog
        open={isAddingField}
        onClose={() => setIsAddingField(false)}
        onAddField={handleAddField}
      />
    </div>
  );
};