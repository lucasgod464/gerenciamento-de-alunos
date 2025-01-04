import { FormField } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface StudentFormProps {
  fields: FormField[];
  onSubmit: (formData: any) => Promise<void>;
  submitButtonText: string;
  initialData?: any;
}

export const StudentForm = ({ fields, onSubmit, submitButtonText, initialData }: StudentFormProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData: any = {};
    const formElement = event.currentTarget as HTMLFormElement;
    
    fields.forEach(field => {
      const input = formElement.querySelector(`[name="${field.name}"]`) as HTMLInputElement | HTMLSelectElement;
      formData[field.name] = input.value;
    });
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(field => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          
          {field.type === "text" && (
            <Input
              type="text"
              id={field.name}
              name={field.name}
              required={field.required}
              defaultValue={initialData?.[field.name] || ""}
            />
          )}
          
          {field.type === "date" && (
            <Input
              type="date"
              id={field.name}
              name={field.name}
              required={field.required}
              defaultValue={initialData?.[field.name] || ""}
            />
          )}
          
          {field.type === "select" && field.options && (
            <Select 
              name={field.name}
              defaultValue={initialData?.[field.name] || field.options[0]}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {field.options.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      ))}
      
      <Button type="submit" className="w-full">
        {submitButtonText}
      </Button>
    </form>
  );
};

export default StudentForm;