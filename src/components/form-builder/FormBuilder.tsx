import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormField } from "@/types/form";
import { AddFieldDialog } from "./AddFieldDialog";
import { FormPreview } from "./FormPreview";
import { useAuth } from "@/hooks/useAuth";

export const FormBuilder = () => {
  const { user: currentUser } = useAuth();
  const [fields, setFields] = useState<FormField[]>([
    {
      id: "name",
      name: "fullName",
      label: "Nome Completo",
      type: "text",
      required: true,
      order: 0,
    },
    {
      id: "birthDate",
      name: "birthDate",
      label: "Data de Nascimento",
      type: "date",
      required: true,
      order: 1,
    },
    {
      id: "status",
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      order: 2,
      options: [
        { label: "Ativo", value: "active" },
        { label: "Inativo", value: "inactive" },
      ],
    },
    {
      id: "room",
      name: "room",
      label: "Sala",
      type: "select",
      required: true,
      order: 3,
      options: [], // Will be populated from rooms data
    },
  ]);

  const [isAddingField, setIsAddingField] = useState(false);

  useEffect(() => {
    // Save form fields to localStorage whenever they change
    localStorage.setItem("formFields", JSON.stringify(fields));
  }, [fields]);

  const handleAddField = (field: Omit<FormField, "id" | "order">) => {
    const newField: FormField = {
      ...field,
      id: Math.random().toString(36).substr(2, 9),
      order: fields.length,
    };
    setFields([...fields, newField]);
    setIsAddingField(false);
  };

  const handleDeleteField = (id: string) => {
    const defaultFields = ["name", "birthDate", "status", "room"];
    if (defaultFields.includes(id)) {
      return; // Prevent deletion of default fields
    }
    setFields(fields.filter((field) => field.id !== id));
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