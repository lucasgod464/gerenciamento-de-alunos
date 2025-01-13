import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryFieldsProps {
  defaultValues?: {
    specialization?: string;
  };
  specializations?: Array<{ id: string; name: string }>;
}

export function CategoryFields({ defaultValues, specializations = [] }: CategoryFieldsProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="specialization">Especialização</Label>
      <Select name="specialization" defaultValue={defaultValues?.specialization}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma especialização" />
        </SelectTrigger>
        <SelectContent>
          {specializations.map((spec) => (
            <SelectItem key={spec.id} value={spec.id}>
              {spec.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
