import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/types/form";

interface CustomTextFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
}

export const CustomTextField = ({ field, value, onChange }: CustomTextFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={field.name}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
      />
    </div>
  );
};