import { FormField } from "@/types/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomFieldsProps {
  fields: FormField[];
  initialData?: Record<string, string>;
}

export const CustomFields = ({ fields, initialData }: CustomFieldsProps) => {
  const renderCustomField = (field: FormField) => {
    const value = initialData?.[field.name] || "";

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            key={field.id}
            id={field.name}
            name={field.name}
            required={field.required}
            defaultValue={value}
          />
        );
      case "select":
        return (
          <Select key={field.id} defaultValue={value} name={field.name}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "email":
        return (
          <Input
            key={field.id}
            id={field.name}
            name={field.name}
            type="email"
            required={field.required}
            defaultValue={value}
          />
        );
      case "tel":
        return (
          <Input
            key={field.id}
            id={field.name}
            name={field.name}
            type="tel"
            required={field.required}
            defaultValue={value}
          />
        );
      case "date":
        return (
          <Input
            key={field.id}
            id={field.name}
            name={field.name}
            type="date"
            required={field.required}
            defaultValue={value}
          />
        );
      default:
        return (
          <Input
            key={field.id}
            id={field.name}
            name={field.name}
            type="text"
            required={field.required}
            defaultValue={value}
          />
        );
    }
  };

  return (
    <>
      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          {renderCustomField(field)}
        </div>
      ))}
    </>
  );
};