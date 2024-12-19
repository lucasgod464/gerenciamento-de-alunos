import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/types/form-builder";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface DynamicFormFieldProps {
  field: FormField;
  value?: any;
  onChange?: (value: any) => void;
}

export const DynamicFormField = ({
  field,
  value,
  onChange,
}: DynamicFormFieldProps) => {
  const [switchValue, setSwitchValue] = useState(false);

  const handleChange = (newValue: any) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const renderField = () => {
    switch (field.type) {
      case "select":
        return (
          <Select
            value={value || ""}
            onValueChange={handleChange}
            disabled={!onChange}
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
        );
      case "textarea":
        return (
          <Textarea
            id={field.id}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            required={field.required}
            disabled={!onChange}
          />
        );
      case "checkbox":
        return (
          <Switch
            id={field.id}
            checked={switchValue}
            onCheckedChange={(checked) => {
              setSwitchValue(checked);
              handleChange(checked);
            }}
            disabled={!onChange}
          />
        );
      default:
        return (
          <Input
            id={field.id}
            type={field.type}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
            disabled={!onChange}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
    </div>
  );
};