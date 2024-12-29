import { Label } from "@/components/ui/label";
import { CategorySelect } from "../CategorySelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFieldsProps {
  defaultValues?: {
    specialization?: string;
    responsibleCategory?: string;
  };
  specializations: Array<{ id: string; name: string }>;
}

export function CategoryFields({ defaultValues, specializations }: CategoryFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="responsibleCategory">Categoria Responsável</Label>
        <CategorySelect 
          value={defaultValues?.responsibleCategory || ""} 
          onChange={() => {}}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="specialization">Especialização</Label>
        <Select name="specialization" defaultValue={defaultValues?.specialization}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a especialização" />
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
    </>
  );
}