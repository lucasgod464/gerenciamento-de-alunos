import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormPreview } from "./EnrollmentFormPreview";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormField } from "@/types/form";

interface EnrollmentFormConfigProps {
  fields: FormField[];
  onAddField: () => void;
  onDeleteField: (id: string) => void;
  onEditField: (field: FormField) => void;
  onReorderFields: (fields: FormField[]) => void;
}

export const EnrollmentFormConfig = ({
  fields,
  onAddField,
  onDeleteField,
  onEditField,
  onReorderFields,
}: EnrollmentFormConfigProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Configuração do Formulário</CardTitle>
            <CardDescription>
              Personalize os campos e seções do formulário de inscrição
            </CardDescription>
          </div>
          <Button onClick={onAddField}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Campo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <FormPreview 
          fields={fields} 
          onDeleteField={onDeleteField}
          onEditField={onEditField}
          onReorderFields={onReorderFields}
        />
      </CardContent>
    </Card>
  );
};