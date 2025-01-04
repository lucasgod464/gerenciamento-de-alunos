import { FormField } from "@/types/form";
import { CustomFieldWrapper } from "./CustomFieldWrapper";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CustomMultipleFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
}

export const CustomMultipleField = ({ field, value, onChange }: CustomMultipleFieldProps) => {
  return (
    <CustomFieldWrapper field={field}>
      <RadioGroup value={value} onValueChange={onChange}>
        {field.options?.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`${field.name}-${option}`} />
            <Label htmlFor={`${field.name}-${option}`}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
    </CustomFieldWrapper>
  );
};