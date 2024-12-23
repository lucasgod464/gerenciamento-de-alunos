import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusFieldProps {
  defaultValue?: string;
}

export function StatusField({ defaultValue }: StatusFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="status">Status</Label>
      <Select name="status" defaultValue={defaultValue || "active"}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Ativo</SelectItem>
          <SelectItem value="inactive">Inativo</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}