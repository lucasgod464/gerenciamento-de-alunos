import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormField } from "@/types/form";
import { AddFieldDialog } from "./AddFieldDialog";
import { FormPreview } from "./FormPreview";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface FormBuilderProps {
  storageKey?: string;
  defaultFields?: FormField[];
}

export const FormBuilder = ({ 
  storageKey = "formFields",
  defaultFields = []
}: FormBuilderProps) => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  
  const [fields, setFields] = useState<FormField[]>([]);
  const [isAddingField, setIsAddingField] = useState(false);

  // Load fields from localStorage on component mount
  useEffect(() => {
    try {
      const savedFields = localStorage.getItem(storageKey);
      if (savedFields) {
        const parsedFields = JSON.parse(savedFields);
        // Ensure default fields are always present
        const mergedFields = defaultFields.concat(
          parsedFields.filter((field: FormField) => 
            !defaultFields.some(defaultField => defaultField.id === field.id)
          )
        );
        setFields(mergedFields);
      } else {
        setFields(defaultFields);
        localStorage.setItem(storageKey, JSON.stringify(defaultFields));
      }
    } catch (error) {
      console.error("Error loading form fields:", error);
      setFields(defaultFields);
    }
  }, [storageKey]); // Remove defaultFields from dependencies to prevent re-renders

  // Save fields to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(fields));
      console.log("Fields saved to localStorage:", fields); // Debug log
    } catch (error) {
      console.error("Error saving form fields:", error);
    }
  }, [fields, storageKey]);

  const handleAddField = (field: Omit<FormField, "id" | "order">) => {
    const newField: FormField = {
      ...field,
      id: Math.random().toString(36).substr(2, 9),
      order: fields.length,
    };
    
    setFields(prevFields => [...prevFields, newField]);
    setIsAddingField(false);
    
    toast({
      title: "Campo adicionado",
      description: "O novo campo foi adicionado com sucesso.",
    });
  };

  const handleDeleteField = (id: string) => {
    const defaultFieldIds = defaultFields.map(field => field.id);
    if (defaultFieldIds.includes(id)) {
      return;
    }
    
    setFields(prevFields => prevFields.filter(field => field.id !== id));
    
    toast({
      title: "Campo removido",
      description: "O campo foi removido com sucesso.",
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