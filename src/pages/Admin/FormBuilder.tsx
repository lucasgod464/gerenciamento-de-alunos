import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FormFieldList } from "@/components/form-builder/FormFieldList";
import { AddFieldDialog } from "@/components/form-builder/AddFieldDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FormField } from "@/types/form-builder";

const FormBuilder = () => {
  const [fields, setFields] = useState<FormField[]>([
    {
      id: "name",
      label: "Nome Completo",
      type: "text",
      required: true,
      order: 1,
      isDefault: true,
    },
    {
      id: "age",
      label: "Idade",
      type: "number",
      required: true,
      order: 2,
      isDefault: true,
    },
  ]);
  const { toast } = useToast();

  const handleAddField = (newField: Omit<FormField, "id" | "order">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const order = Math.max(...fields.map((f) => f.order), 0) + 1;
    
    setFields((prev) => [...prev, { ...newField, id, order }]);
    toast({
      title: "Campo adicionado",
      description: "O novo campo foi adicionado com sucesso.",
    });
  };

  const handleDeleteField = (id: string) => {
    const field = fields.find((f) => f.id === id);
    if (field?.isDefault) {
      toast({
        title: "Operação não permitida",
        description: "Campos padrão não podem ser removidos.",
        variant: "destructive",
      });
      return;
    }

    setFields((prev) => prev.filter((field) => field.id !== id));
    toast({
      title: "Campo removido",
      description: "O campo foi removido com sucesso.",
    });
  };

  const handleUpdateField = (updatedField: FormField) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === updatedField.id ? updatedField : field
      )
    );
    toast({
      title: "Campo atualizado",
      description: "O campo foi atualizado com sucesso.",
    });
  };

  const handleSaveForm = () => {
    localStorage.setItem("formFields", JSON.stringify(fields));
    toast({
      title: "Formulário salvo",
      description: "As configurações do formulário foram salvas com sucesso.",
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Construtor de Formulários</h1>
            <p className="text-muted-foreground">
              Personalize o formulário de cadastro de alunos
            </p>
          </div>
          <div className="flex gap-4">
            <AddFieldDialog onAddField={handleAddField} />
            <Button onClick={handleSaveForm}>Salvar Alterações</Button>
          </div>
        </div>

        <FormFieldList
          fields={fields}
          onDeleteField={handleDeleteField}
          onUpdateField={handleUpdateField}
        />
      </div>
    </DashboardLayout>
  );
};

export default FormBuilder;