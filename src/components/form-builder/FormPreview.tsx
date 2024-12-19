import { FormField } from "@/types/form-builder";
import { DynamicFormField } from "./DynamicFormField";

interface FormPreviewProps {
  fields: FormField[];
}

export const FormPreview = ({ fields }: FormPreviewProps) => {
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  return (
    <form className="space-y-4">
      {sortedFields.map((field) => (
        <DynamicFormField key={field.id} field={field} />
      ))}
    </form>
  );
};