import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormField } from "@/types/form";
import { AddFieldDialog } from "./AddFieldDialog";
import { FormPreview } from "./FormPreview";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const FormBuilder = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const defaultFields: FormField[] = [
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
      options: [],
    },
  ];

  const [fields, setFields] = useState<FormField[]>(defaultFields);
  const [isAddingField, setIsAddingField] = useState(false);

  // Carrega os campos salvos do localStorage
  useEffect(() => {
    const savedFields = localStorage.getItem(`formFields_${currentUser?.companyId}`);
    if (savedFields) {
      try {
        const parsedFields = JSON.parse(savedFields);
        // Garante que os campos padrão estejam sempre presentes
        const mergedFields = defaultFields.concat(
          parsedFields.filter((field: FormField) => 
            !defaultFields.some(defaultField => defaultField.id === field.id)
          )
        );
        setFields(mergedFields);
      } catch (error) {
        console.error("Erro ao carregar campos salvos:", error);
        setFields(defaultFields);
      }
    }
  }, [currentUser?.companyId]);

  // Salva os campos no localStorage sempre que houver mudanças
  useEffect(() => {
    if (currentUser?.companyId) {
      localStorage.setItem(`formFields_${currentUser.companyId}`, JSON.stringify(fields));
    }
  }, [fields, currentUser?.companyId]);

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
    const defaultFieldIds = ["name", "birthDate", "status", "room"];
    if (defaultFieldIds.includes(id)) {
      return;
    }
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