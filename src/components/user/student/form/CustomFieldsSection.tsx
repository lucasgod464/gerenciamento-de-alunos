import { FormField } from "@/types/form";
import { FormSection } from "./FormSection";
import { CustomTextField } from "../form-fields/CustomTextField";
import { CustomPhoneField } from "../form-fields/CustomPhoneField";
import { CustomSelectField } from "../form-fields/CustomSelectField";
import { CustomMultipleField } from "../form-fields/CustomMultipleField";

interface CustomFieldsSectionProps {
  title: string;
  fields: FormField[];
  currentValues: Record<string, any>;
  onFieldChange: (field: FormField, value: any) => void;
  show?: boolean;
}

export const CustomFieldsSection = ({
  title,
  fields,
  currentValues,
  onFieldChange,
  show = true
}: CustomFieldsSectionProps) => {
  const renderCustomField = (field: FormField) => {
    const currentValue = currentValues[field.id]?.value || "";

    const commonProps = {
      key: field.id,
      field: field,
      value: currentValue,
      onChange: (newValue: any) => onFieldChange(field, newValue)
    };

    switch (field.type) {
      case "text":
      case "email":
        return <CustomTextField {...commonProps} />;
      case "tel":
        return <CustomPhoneField {...commonProps} />;
      case "select":
        return <CustomSelectField {...commonProps} />;
      case "multiple":
        return <CustomMultipleField {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <FormSection title={title} show={show}>
      {fields.map((field) => (
        <div key={`field-wrapper-${field.id}`}>
          {renderCustomField(field)}
        </div>
      ))}
    </FormSection>
  );
};
