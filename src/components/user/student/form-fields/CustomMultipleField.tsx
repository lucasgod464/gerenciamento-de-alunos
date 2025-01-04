import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormField } from "@/types/form";
import { CustomFieldWrapper } from "./CustomFieldWrapper";

interface CustomMultipleFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
}

export const CustomMultipleField = ({ field, value, onChange }: CustomMultipleFieldProps) => {
  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  return (
    <CustomFieldWrapper field={field}>
      <RadioGroup 
        value={value} 
        onValueChange={handleChange} 
        name={`custom-field-${field.id}-${field.name}`}
      >
        {field.options?.map((option) => (
          <div key={`${field.id}-${field.name}-${option}`} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={option} 
              id={`${field.id}-${field.name}-${option}`} 
            />
            <Label htmlFor={`${field.id}-${field.name}-${option}`}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
    </CustomFieldWrapper>
  );
};