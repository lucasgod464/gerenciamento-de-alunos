import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FormBuilderHeaderProps {
  onAddField: () => void;
}

export const FormBuilderHeader = ({ onAddField }: FormBuilderHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Configuração do Formulário</CardTitle>
            <p className="text-sm text-muted-foreground">
              Personalize os campos do formulário de cadastro
            </p>
          </div>
          <Button onClick={onAddField}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Campo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Arraste e solte os campos para reordenar. Clique em editar para modificar um campo existente.
        </p>
      </CardContent>
    </Card>
  );
};