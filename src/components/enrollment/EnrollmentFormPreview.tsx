import { FormField } from "@/types/form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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
              </div>
              <p className="text-sm text-muted-foreground">
                Tipo: {field.type}
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
      {fields.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          Nenhum campo adicionado. Clique em "Adicionar Campo" para começar.
        </p>
      )}
    </div>
  );
};