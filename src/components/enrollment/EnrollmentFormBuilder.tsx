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
          // Filter duplicate fields, deleted fields, and hidden fields
          const uniqueFields = parsedFields.filter((field: FormField, index: number, self: FormField[]) => {
            const isNotDeleted = !deletedFields.includes(field.id);
            const isNotHidden = !HIDDEN_FIELDS.includes(field.name);
            const isFirstOccurrence = index === self.findIndex((f) => f.name === field.name);
            return isNotDeleted && isNotHidden && isFirstOccurrence;
          });
          
          // Ensure default fields are present
          DEFAULT_FIELDS.forEach(defaultField => {
            const fieldExists = uniqueFields.some(field => field.name === defaultField.name);
            if (!fieldExists) {
              uniqueFields.unshift(defaultField);
            }
          });

          // Sort fields based on order property
          const sortedFields = uniqueFields.sort((a, b) => a.order - b.order);
          setFields(sortedFields);
        }
      } catch (error) {
        console.error("Error loading form builder fields:", error);
        setFields(DEFAULT_FIELDS);
      }
    };

    loadFields();
  }, [deletedFields]);

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
        title: "Field updated",
        description: "The field was successfully updated.",
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
        title: "Field added",
        description: "The new field was successfully added.",
      });
    }
    setIsAddingField(false);
  };

  const handleDeleteField = (id: string) => {
    if (DEFAULT_FIELDS.some(field => field.id === id)) {
      toast({
        title: "Operation not allowed",
        description: "This field is required and cannot be removed.",
        variant: "destructive",
      });
      return;
    }

    const updatedFields = fields.filter((field) => field.id !== id);
    setFields(updatedFields);
    setDeletedFields(prev => [...prev, id]);
    
    toast({
      title: "Field removed",
      description: "The field was successfully removed.",
    });
  };

  const handleEditField = (field: FormField) => {
    if (DEFAULT_FIELDS.some(defaultField => defaultField.id === field.id)) {
      toast({
        title: "Operation not allowed",
        description: "This field is required and cannot be edited.",
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
    toast({
      title: "Order updated",
      description: "The field order was successfully updated.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Enrollment Form Fields</h2>
          <Button onClick={() => {
            setEditingField(undefined);
            setIsAddingField(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Field
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