import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/types/form"
import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface CustomFieldsProps {
  fields: FormField[]
  initialData?: any
  formRef: React.RefObject<HTMLFormElement>
}

export const CustomFields = ({ fields, initialData, formRef }: CustomFieldsProps) => {
  const [multipleSelections, setMultipleSelections] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    fields.forEach((field) => {
      if (field.type === "multiple") {
        initial[field.name] = initialData?.customFields?.[field.name]?.split(",") || [];
      }
    });
    return initial;
  });

  useEffect(() => {
    if (!formRef.current) return;

    const form = formRef.current;
    const handleSubmit = () => {
      fields.forEach((field) => {
        if (field.type === "multiple") {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = field.name;
          input.value = multipleSelections[field.name]?.join(",") || "";
          form.appendChild(input);
        }
      });
    };

    form.addEventListener("submit", handleSubmit);
    return () => {
      form.removeEventListener("submit", handleSubmit);
    };
  }, [fields, formRef, multipleSelections]);

  // Filtrar campos padrão, exceto nome_completo e data_nascimento
  const customFields = fields.filter(field => 
    !["sala", "status"].includes(field.name)
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
              {field.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.name}-${option}`}
                    checked={multipleSelections[field.name]?.includes(option)}
                    onCheckedChange={(checked) => {
                      setMultipleSelections(prev => {
                        const current = prev[field.name] || [];
                        if (checked) {
                          return {
                            ...prev,
                            [field.name]: [...current, option]
                          };
                        } else {
                          return {
                            ...prev,
                            [field.name]: current.filter(item => item !== option)
                          };
                        }
                      });
                    }}
                  />
                  <label
                    htmlFor={`${field.name}-${option}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ) : field.type === "select" ? (
            <Select
              name={field.name}
              required={field.required}
              defaultValue={initialData?.customFields?.[field.name]}
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
          ) : field.type === "date" ? (
            <Input
              name={field.name}
              type="date"
              required={field.required}
              defaultValue={initialData?.customFields?.[field.name]}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
};