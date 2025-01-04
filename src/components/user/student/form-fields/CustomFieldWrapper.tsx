import { Label } from "@/components/ui/label";
import { FormField } from "@/types/form";

interface CustomFieldWrapperProps {
  field: FormField;
  children: React.ReactNode;
}

export const CustomFieldWrapper = ({ field, children }: CustomFieldWrapperProps) => {
  return (
    <div className="space-y-2">
      <Label>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
    </div>
  );
};