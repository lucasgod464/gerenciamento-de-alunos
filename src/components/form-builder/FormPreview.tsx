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
              <p className="text-sm text-muted-foreground">
                Tipo: {field.type}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteField(field.id)}
              className={
                ["name", "birthDate", "status", "room"].includes(field.id)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};