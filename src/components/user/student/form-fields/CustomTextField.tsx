import { Input } from "@/components/ui/input";
import { FormField } from "@/types/form";
import { CustomFieldWrapper } from "./CustomFieldWrapper";

interface CustomTextFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
}

export const CustomTextField = ({ field, value, onChange }: CustomTextFieldProps) => {
  return (
    <CustomFieldWrapper field={field}>
      <Input
        type={field.type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Digite ${field.label.toLowerCase()}`}
        required={field.required}
      />
    </CustomFieldWrapper>
  );
};