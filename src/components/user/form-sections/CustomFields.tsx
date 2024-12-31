import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/types/form";

interface CustomFieldsProps {
  fields: FormField[];
  initialData?: any;
  formRef: React.RefObject<HTMLFormElement>;
}

export const CustomFields = ({ fields, initialData, formRef }: CustomFieldsProps) => {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          {field.type === "textarea" ? (
            <Textarea
              id={field.name}
              name={field.name}
              required={field.required}
              defaultValue={initialData?.customFields?.[field.name]}
            />
          ) : field.type === "select" || field.type === "multiple" ? (
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
                <SelectValue placeholder={`Selecione ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              required={field.required}
              defaultValue={initialData?.customFields?.[field.name]}
            />
          )}
        </div>
      ))}
    </div>
  );
};