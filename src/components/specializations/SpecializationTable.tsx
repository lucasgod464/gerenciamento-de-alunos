import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Specialization {
  id: string;
  name: string;
  status: boolean;
  companyId: string | null;
}

interface SpecializationTableProps {
  specializations: Specialization[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SpecializationTable({
  specializations,
  onToggleStatus,
  onDelete,
}: SpecializationTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {specializations.map((spec) => (
            <TableRow key={spec.id}>
              <TableCell>{spec.name}</TableCell>
              <TableCell>
                <Switch
                  checked={spec.status}
                  onCheckedChange={() => onToggleStatus(spec.id)}
                />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(spec.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}