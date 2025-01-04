import { Label } from "@/components/ui/label";
import { FormField } from "@/types/form";
import { Checkbox } from "@/components/ui/checkbox";

interface CustomMultipleFieldProps {
  field: FormField;
  value: string[];
  onChange: (value: string[]) => void;
}

export const CustomMultipleField = ({ field, value = [], onChange }: CustomMultipleFieldProps) => {
  return (
    <div className="space-y-2">
      <Label>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="space-y-2">
        {field.options?.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`${field.name}-${option}`}
              checked={value.includes(option)}
              onCheckedChange={(checked) => {
                const newValues = checked
                  ? [...value, option]
                  : value.filter((v) => v !== option);
                onChange(newValues);
              }}
            />
            <label
              htmlFor={`${field.name}-${option}`}
              className="text-sm font-medium leading-none"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};