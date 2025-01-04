import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField, SupabaseFormField, mapSupabaseFormField } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function PublicEnrollment() {
  const { toast } = useToast();
  const [fields, setFields] = useState<FormField[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

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
      const customFields: Record<string, any> = {};
      fields.forEach(field => {
        customFields[field.id] = {
          fieldId: field.id,
          fieldName: field.name,
          label: field.label,
          value: data[field.name],
          type: field.type
        };
      });

      const { data: newStudent, error: studentError } = await supabase
        .from('students')
        .insert({
          name: data.nome_completo,
          birth_date: data.data_nascimento,
          status: true,
          custom_fields: customFields,
          company_id: null // This will be assigned by RLS policy
        })
        .select()
        .single();

      if (studentError) throw studentError;

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
    const commonProps = {
      ...register(field.name, { required: field.required }),
      id: field.name,
      className: errors[field.name] ? "border-red-500" : ""
    };

    switch (field.type) {
      case "textarea":
        return <Textarea {...commonProps} />;
      case "select":
        return (
          <Select
            onValueChange={(value) => setValue(field.name, value)}
            value={watch(field.name)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma opção" />
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
      case "multiple":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.name}-${option}`}
                  checked={watch(field.name)?.includes(option)}
                  onCheckedChange={(checked) => {
                    const current = watch(field.name) || [];
                    const updated = checked
                      ? [...current, option]
                      : current.filter((value: string) => value !== option);
                    setValue(field.name, updated);
                  }}
                />
                <label htmlFor={`${field.name}-${option}`}>{option}</label>
              </div>
            ))}
          </div>
        );
      default:
        return <Input {...commonProps} type={field.type} />;
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
              <div className="space-y-2">
                <Label htmlFor="nome_completo">
                  Nome Completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nome_completo"
                  {...register("nome_completo", { required: true })}
                  className={errors.nome_completo ? "border-red-500" : ""}
                />
                {errors.nome_completo && (
                  <p className="text-sm text-red-500">
                    Nome completo é obrigatório
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_nascimento">
                  Data de Nascimento <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="data_nascimento"
                  type="date"
                  {...register("data_nascimento", { required: true })}
                  className={errors.data_nascimento ? "border-red-500" : ""}
                />
                {errors.data_nascimento && (
                  <p className="text-sm text-red-500">
                    Data de nascimento é obrigatória
                  </p>
                )}
              </div>

              {fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.name}>
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