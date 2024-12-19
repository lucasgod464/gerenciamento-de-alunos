import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AddFieldDialog } from "@/components/form-builder/AddFieldDialog";
import { FormFieldList } from "@/components/form-builder/FormFieldList";
import { FormPreview } from "@/components/form-builder/FormPreview";
import { FormField } from "@/types/form-builder";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FormBuilderPage = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;

    const savedFields = localStorage.getItem("formFields");
    if (savedFields) {
      const allFields = JSON.parse(savedFields);
      const companyFields = allFields.filter(
        (field: FormField) => field.companyId === currentUser.companyId
      );
      setFields(companyFields);
    } else {
      // Initialize with default fields
      const defaultFields: FormField[] = [
        {
          id: uuidv4(),
          name: "name",
          label: "Nome Completo",
          type: "text",
          required: true,
          order: 1,
          isDefault: true,
          companyId: currentUser.companyId,
          placeholder: "Nome do aluno"
        },
        {
          id: uuidv4(),
          name: "birthDate",
          label: "Data de Nascimento",
          type: "date",
          required: true,
          order: 2,
          isDefault: true,
          companyId: currentUser.companyId
        },
        {
          id: uuidv4(),
          name: "email",
          label: "Email",
          type: "email",
          required: false,
          order: 3,
          isDefault: false,
          companyId: currentUser.companyId,
          placeholder: "email@exemplo.com"
        },
        {
          id: uuidv4(),
          name: "document",
          label: "CPF/RG",
          type: "text",
          required: false,
          order: 4,
          isDefault: false,
          companyId: currentUser.companyId,
          placeholder: "000.000.000-00"
        },
        {
          id: uuidv4(),
          name: "address",
          label: "Endereço Completo",
          type: "text",
          required: false,
          order: 5,
          isDefault: false,
          companyId: currentUser.companyId,
          placeholder: "Rua, número, bairro, cidade, estado"
        }
      ];
      setFields(defaultFields);
      localStorage.setItem("formFields", JSON.stringify(defaultFields));
    }
  }, [currentUser]);

  const handleAddField = (newField: Omit<FormField, "id" | "order" | "companyId">) => {
    const field: FormField = {
      ...newField,
      id: uuidv4(),
      order: fields.length + 1,
      companyId: currentUser?.companyId || null,
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
    const fieldToDelete = fields.find(field => field.id === id);
    if (fieldToDelete?.isDefault) {
      toast({
        title: "Operação não permitida",
        description: "Campos padrão não podem ser removidos.",
        variant: "destructive"
      });
      return;
    }

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

        <Tabs defaultValue="editor" className="space-y-6">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Visualização</TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            <Card>
              <CardContent className="pt-6">
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <FormPreview fields={fields} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FormBuilderPage;