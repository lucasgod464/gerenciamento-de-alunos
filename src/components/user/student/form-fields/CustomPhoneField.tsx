import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/types/form";
import { useToast } from "@/hooks/use-toast";

interface CustomPhoneFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
}

export const CustomPhoneField = ({ field, value, onChange }: CustomPhoneFieldProps) => {
  const { toast } = useToast();

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    if (e.target.value !== numericValue) {
      toast({
        title: "Apenas números são permitidos",
        description: "Por favor, insira apenas números no campo de telefone",
        variant: "destructive",
      });
    }
    onChange(numericValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={field.name}
        type="tel"
        value={value || ""}
        onChange={handlePhoneInput}
        required={field.required}
        pattern="[0-9]*"
        inputMode="numeric"
        maxLength={15}
      />
    </div>
  );
};