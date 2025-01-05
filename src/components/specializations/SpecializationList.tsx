import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Specialization } from "@/types/specialization";

interface SpecializationListProps {
  specializations: Specialization[];
  onEdit: (spec: Specialization) => void;
  onDelete: (spec: Specialization) => void;
  onToggleStatus: (id: string) => void;
}

export const SpecializationList = ({
  specializations,
  onEdit,
  onDelete,
  onToggleStatus,
}: SpecializationListProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[400px] text-left">Nome</TableHead>
            <TableHead className="text-left">Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {specializations.map((spec) => (
            <TableRow key={spec.id} className="hover:bg-muted/50">
              <TableCell className="text-left">{spec.name}</TableCell>
              <TableCell className="text-left">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={spec.status}
                    onCheckedChange={() => onToggleStatus(spec.id)}
                  />
                  <Badge
                    variant={spec.status ? "success" : "secondary"}
                    className="ml-2"
                  >
                    {spec.status ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(spec)}
                    className="hover:bg-primary/10"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(spec)}
                    className="hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {specializations.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                Nenhuma especialização encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};