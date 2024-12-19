import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/types/form-builder";

interface DynamicFormFieldProps {
  field: FormField;
}

export const DynamicFormField = ({ field }: DynamicFormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.id}>{field.label}</Label>
      <Input
        id={field.id}
        name={field.id}
        type={field.type}
        required={field.required}
        min={field.validation?.min}
        max={field.validation?.max}
      />
    </div>
  );
};