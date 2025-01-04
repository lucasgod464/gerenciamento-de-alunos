import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/types/form";
import { CustomFieldWrapper } from "./CustomFieldWrapper";

interface CustomSelectFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
}

export const CustomSelectField = ({ field, value, onChange }: CustomSelectFieldProps) => {
  return (
    <CustomFieldWrapper field={field}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Selecione ${field.label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </CustomFieldWrapper>
  );
};