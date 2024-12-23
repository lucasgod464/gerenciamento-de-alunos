import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SpecializationHeaderProps {
  onOpenDialog: () => void;
}

export function SpecializationHeader({ onOpenDialog }: SpecializationHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Especializações</h1>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Gerencie as especializações do sistema
        </p>
        <Button onClick={onOpenDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Especialização
        </Button>
      </div>
    </div>
  );
}