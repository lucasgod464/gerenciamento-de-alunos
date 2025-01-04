import { Label } from "@/components/ui/label";
import { FormField } from "@/types/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomSelectFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
}

export const CustomSelectField = ({ field, value, onChange }: CustomSelectFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select
        value={value || ""}
        onValueChange={onChange}
        required={field.required}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma opção" />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};