import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/types/form";
import { useState } from "react";

interface CustomFieldsProps {
  fields: FormField[];
  initialData?: any;
  formRef: React.RefObject<HTMLFormElement>;
}

export const CustomFields = ({ fields, initialData, formRef }: CustomFieldsProps) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    fields.forEach((field) => {
      if (field.type === "multiple") {
        initial[field.name] = initialData?.customFields?.[field.name]?.split(",") || [];
      }
    });
    return initial;
  });

  const handleCheckboxChange = (fieldName: string, option: string, checked: boolean) => {
    setSelectedOptions((prev) => {
      const currentValues = prev[fieldName] || [];
      const newValues = checked
        ? [...currentValues, option]
        : currentValues.filter((value) => value !== option);

      // Update the hidden input value for form submission
      const formElement = formRef.current;
      if (formElement) {
        const input = formElement.elements.namedItem(fieldName) as HTMLInputElement;
        if (input) {
          input.value = newValues.join(",");
        }
      }

      return {
        ...prev,
        [fieldName]: newValues,
      };
    });
  };

  // Filtrar campos padrão
  const customFields = fields.filter(field => 
    !["nome_completo", "data_nascimento", "sala", "status"].includes(field.name)
  );

  return (
    <div className="space-y-4">
      {customFields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label>{field.label}</Label>
          {field.type === "text" ? (
            <Input
              name={field.name}
              type="text"
              required={field.required}
              defaultValue={initialData?.customFields?.[field.name]}
            />
          ) : field.type === "multiple" ? (
            <div className="space-y-2">
              {/* Hidden input to store the selected values */}
              <input
                type="hidden"
                name={field.name}
                value={selectedOptions[field.name]?.join(",") || ""}
              />
              {field.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.name}-${option}`}
                    checked={selectedOptions[field.name]?.includes(option)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(field.name, option, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`${field.name}-${option}`}
                    className="text-sm text-gray-700"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ) : field.type === "select" ? (
            <Select
              value={initialData?.customFields?.[field.name] || ""}
              onValueChange={(value) => {
                const formElement = formRef.current;
                if (formElement) {
                  const input = formElement.elements.namedItem(field.name) as HTMLInputElement;
                  if (input) {
                    input.value = value;
                  }
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : field.type === "textarea" ? (
            <Textarea
              name={field.name}
              required={field.required}
              defaultValue={initialData?.customFields?.[field.name]}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
};