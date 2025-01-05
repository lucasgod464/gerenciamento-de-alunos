import { Input } from "@/components/ui/input";
import { FormField } from "@/types/form";
import { CustomFieldWrapper } from "./CustomFieldWrapper";

interface CustomPhoneFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
}

export const CustomPhoneField = ({ field, value, onChange }: CustomPhoneFieldProps) => {
  const formatPhoneNumber = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      let formatted = numbers;
      // Formato: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
      if (numbers.length > 2) {
        formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      }
      if (numbers.length > 7) {
        const isNineDigit = numbers.length > 10;
        const position = isNineDigit ? 7 : 6;
        formatted = formatted.slice(0, position + 5) + '-' + formatted.slice(position + 5);
      }
      return formatted;
    }
    return numbers.slice(0, 11); // Limita a 11 dígitos
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    onChange(formattedValue.replace(/\D/g, '')); // Salva apenas números
  };

  const formattedValue = formatPhoneNumber(value);

  return (
    <CustomFieldWrapper field={field}>
      <Input
        type="tel"
        value={formattedValue}
        onChange={handlePhoneChange}
        placeholder="(XX) XXXXX-XXXX"
        required={field.required}
        pattern="\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}"
        title="Digite um telefone válido: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX"
      />
    </CustomFieldWrapper>
  );
};