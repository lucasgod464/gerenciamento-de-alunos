import { FormField } from "@/types/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
            id={field.name}
            name={field.name}
            required={field.required}
            defaultValue={value}
          />
        );
      case "email":
        return (
          <Input
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
            id={field.name}
            name={field.name}
            type="tel"
            required={field.required}
            defaultValue={value}
          />
        );
      default:
        return (
          <Input
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