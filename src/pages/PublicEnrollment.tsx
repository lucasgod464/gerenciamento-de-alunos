import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormField, SupabaseFormField, mapSupabaseFormField } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PublicEnrollment() {
  const { toast } = useToast();
  const [fields, setFields] = useState<FormField[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      const { data: formFields, error } = await supabase
        .from('enrollment_form_fields')
        .select('*')
        .order('order');

      if (error) throw error;

      const validatedFields = (formFields || [])
        .map((field: SupabaseFormField) => mapSupabaseFormField(field));

      setFields(validatedFields);
    } catch (error) {
      console.error("Error loading form fields:", error);
      toast({
        title: "Erro ao carregar formulário",
        description: "Não foi possível carregar os campos do formulário.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('students')
        .insert({
          name: data.nome_completo,
          birth_date: data.data_nascimento,
          custom_fields: data
        });

      if (error) throw error;

      toast({
        title: "Inscrição realizada",
        description: "Sua inscrição foi enviada com sucesso!",
      });

      // Reset form
      Object.keys(data).forEach(key => {
        setValue(key, '');
      });
    } catch (error) {
      console.error("Error submitting enrollment:", error);
      toast({
        title: "Erro ao enviar inscrição",
        description: "Não foi possível enviar sua inscrição. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
        return (
          <Input
            {...register(field.name, { required: field.required })}
            type={field.type}
            placeholder={`Digite ${field.label.toLowerCase()}`}
          />
        );
      case "textarea":
        return (
          <Textarea
            {...register(field.name, { required: field.required })}
            placeholder={`Digite ${field.label.toLowerCase()}`}
          />
        );
      case "date":
        return (
          <Input
            {...register(field.name, { required: field.required })}
            type="date"
          />
        );
      case "select":
        return (
          <Select
            onValueChange={(value) => setValue(field.name, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Selecione ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "multiple":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.name}-${index}`}
                  {...register(field.name)}
                  value={option}
                />
                <Label htmlFor={`${field.name}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Formulário de Inscrição</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {field.description && (
                    <p className="text-sm text-muted-foreground">{field.description}</p>
                  )}
                  {renderField(field)}
                  {errors[field.name] && (
                    <p className="text-sm text-red-500">
                      Este campo é obrigatório
                    </p>
                  )}
                </div>
              ))}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar Inscrição"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}