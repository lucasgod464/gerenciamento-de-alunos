import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/types/form";

interface CustomFieldsProps {
  fields: FormField[];
  initialValues?: Record<string, string>;
}

export const CustomFields = ({ fields, initialValues = {} }: CustomFieldsProps) => {
  const renderField = (field: FormField) => {
    const value = initialValues[field.name] || "";

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
      case "tel":
      case "text":
      default:
        return (
          <Input
            id={field.name}
            name={field.name}
            type={field.type}
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
          {renderField(field)}
        </div>
      ))}
    </>
  );
};