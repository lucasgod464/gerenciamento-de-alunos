import { FormField } from "@/types/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PublicEnrollmentFormProps {
  fields: FormField[];
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export const PublicEnrollmentForm = ({ fields, onSubmit, isSubmitting }: PublicEnrollmentFormProps) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  console.log("Campos recebidos no formulário:", fields);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {fields.map((field) => {
        console.log("Renderizando campo:", field);

        if (field.name === "sala" || field.name === "status") {
          return null;
        }

        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.type === "textarea" ? (
              <Textarea
                id={field.name}
                {...register(field.name, { required: field.required })}
                placeholder={`Digite ${field.label.toLowerCase()}`}
                className="w-full"
              />
            ) : field.type === "select" ? (
              <Select onValueChange={(value) => setValue(field.name, value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Selecione ${field.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={field.name}
                type={field.type}
                {...register(field.name, { required: field.required })}
                placeholder={`Digite ${field.label.toLowerCase()}`}
                className="w-full"
              />
            )}
            {errors[field.name] && (
              <p className="text-sm text-red-500">Este campo é obrigatório</p>
            )}
          </div>
        );
      })}
      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enviando..." : "Enviar"}
      </Button>
    </form>
  );
};