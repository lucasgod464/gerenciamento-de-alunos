import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AddFieldDialog } from "@/components/form-builder/AddFieldDialog";
import { FormFieldList } from "@/components/form-builder/FormFieldList";
import { FormPreview } from "@/components/form-builder/FormPreview";
import { FormField } from "@/types/form-builder";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

const FormBuilderPage = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedFields = localStorage.getItem("formFields");
    if (savedFields) {
      setFields(JSON.parse(savedFields));
    } else {
      // Initialize with default required fields
      const defaultFields: FormField[] = [
        {
          id: uuidv4(),
          name: "fullName",
          label: "Nome Completo",
          type: "text",
          required: true,
          order: 1,
          isDefault: true,
        },
        {
          id: uuidv4(),
          name: "birthDate",
          label: "Data de Nascimento",
          type: "date",
          required: true,
          order: 2,
          isDefault: true,
        },
        {
          id: uuidv4(),
          name: "status",
          label: "Status",
          type: "select",
          required: true,
          order: 3,
          isDefault: true,
          options: ["Ativo", "Inativo"],
        },
        {
          id: uuidv4(),
          name: "room",
          label: "Sala",
          type: "select",
          required: true,
          order: 4,
          isDefault: true,
          options: [],
        },
      ];
      setFields(defaultFields);
      localStorage.setItem("formFields", JSON.stringify(defaultFields));
    }
  }, []);

  const handleAddField = (newField: Omit<FormField, "id" | "order">) => {
    const field: FormField = {
      ...newField,
      id: uuidv4(),
      order: fields.length + 1,
    };
    const updatedFields = [...fields, field];
    setFields(updatedFields);
    localStorage.setItem("formFields", JSON.stringify(updatedFields));
    toast({
      title: "Campo adicionado",
      description: "O novo campo foi adicionado com sucesso.",
    });
  };

  const handleUpdateField = (updatedField: FormField) => {
    const updatedFields = fields.map((field) =>
      field.id === updatedField.id ? updatedField : field
    );
    setFields(updatedFields);
    localStorage.setItem("formFields", JSON.stringify(updatedFields));
    toast({
      title: "Campo atualizado",
      description: "O campo foi atualizado com sucesso.",
    });
  };

  const handleDeleteField = (id: string) => {
    const updatedFields = fields.filter((field) => field.id !== id);
    setFields(updatedFields);
    localStorage.setItem("formFields", JSON.stringify(updatedFields));
    toast({
      title: "Campo removido",
      description: "O campo foi removido com sucesso.",
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Construtor de Formulários</h1>
          <p className="text-muted-foreground">
            Personalize o formulário de cadastro de alunos adicionando, editando ou
            removendo campos.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex justify-end">
              <AddFieldDialog onAddField={handleAddField} />
            </div>

            <FormFieldList
              fields={fields}
              onDeleteField={handleDeleteField}
              onUpdateField={handleUpdateField}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Prévia do Formulário</h2>
            <Card className="p-4">
              <FormPreview fields={fields} />
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FormBuilderPage;