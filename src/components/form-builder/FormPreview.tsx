import { FormField } from "@/types/form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FormPreviewProps {
  fields: FormField[];
  onDeleteField: (id: string) => void;
  onEditField: (field: FormField) => void;
}

export const FormPreview = ({ fields, onDeleteField, onEditField }: FormPreviewProps) => {
  // Lista de IDs dos campos obrigatórios do sistema
  const systemRequiredFields = ["nome_completo", "data_nascimento", "sala", "status"];

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const isSystemField = systemRequiredFields.includes(field.id);

        return (
          <Card key={field.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">{field.label}</h3>
                  {field.required && (
                    <Badge variant="secondary">Obrigatório</Badge>
                  )}
                  {isSystemField && (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                {field.description && (
                  <p className="text-sm text-muted-foreground">
                    {field.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Tipo: {field.type}
                  {(field.type === "select" || field.type === "multiple") && field.options && (
                    <span className="ml-2">
                      (Opções: {field.options.join(", ")})
                    </span>
                  )}
                </p>
              </div>
              {!isSystemField && (
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditField(field)}
                    className="hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteField(field.id)}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};