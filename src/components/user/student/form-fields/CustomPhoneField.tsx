import { Input } from "@/components/ui/input";
import { FormField } from "@/types/form";
import { CustomFieldWrapper } from "./CustomFieldWrapper";

interface CustomPhoneFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
}

export const CustomPhoneField = ({ field, value, onChange }: CustomPhoneFieldProps) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    onChange(numericValue);
  };

  return (
    <CustomFieldWrapper field={field}>
      <Input
        type="tel"
        value={value}
        onChange={handlePhoneChange}
        placeholder={`Digite ${field.label.toLowerCase()}`}
        required={field.required}
      />
    </CustomFieldWrapper>
  );
};