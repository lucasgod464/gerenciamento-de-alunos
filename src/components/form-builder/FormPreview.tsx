import { FormField } from "@/types/form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FormPreviewProps {
  fields: FormField[];
  onDeleteField: (id: string) => void;
}

export const FormPreview = ({ fields, onDeleteField }: FormPreviewProps) => {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <Card key={field.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">{field.label}</h3>
                {field.required && (
                  <Badge variant="secondary">Obrigatório</Badge>
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteField(field.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};