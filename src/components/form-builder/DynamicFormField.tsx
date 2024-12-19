import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/types/form-builder";

interface DynamicFormFieldProps {
  field: FormField;
  defaultValue?: string;
}

export const DynamicFormField = ({ field, defaultValue }: DynamicFormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.id}>{field.label}</Label>
      <Input
        id={field.id}
        name={field.name}
        type={field.type}
        required={field.required}
        placeholder={field.placeholder}
        defaultValue={defaultValue}
      />
    </div>
  );
};