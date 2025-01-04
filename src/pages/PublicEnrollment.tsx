import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField, mapSupabaseFormField } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function PublicEnrollment() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
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

      const validatedFields = (formFields || []).map(mapSupabaseFormField);
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
      // Primeiro, buscar a primeira empresa ativa
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('id')
        .eq('status', 'Ativa')
        .limit(1)
        .single();

      if (companiesError) throw companiesError;

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

      const { error: studentError } = await supabase
        .from('students')
        .insert({
          name: data.nome_completo,
          birth_date: data.data_nascimento,
          status: true,
          custom_fields: customFields,
          company_id: companies.id
        });

      if (studentError) throw studentError;

      toast({
        title: "Sucesso!",
        description: "Formulário enviado com sucesso.",
      });

      // Reset form
      Object.keys(data).forEach(key => {
        setValue(key, '');
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro ao enviar formulário",
        description: "Não foi possível enviar o formulário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map(field => (
        <div key={field.id}>
          <Label htmlFor={field.name}>{field.label}</Label>
          {field.type === "textarea" ? (
            <Textarea
              id={field.name}
              {...register(field.name, { required: field.required })}
              placeholder={`Digite ${field.label}`}
            />
          ) : field.type === "select" ? (
            <Select
              id={field.name}
              {...register(field.name, { required: field.required })}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Selecione ${field.label}`} />
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
              {...register(field.name, { required: field.required })}
              placeholder={`Digite ${field.label}`}
            />
          )}
          {errors[field.name] && <p className="text-red-500">Este campo é obrigatório</p>}
        </div>
      ))}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar"}
      </Button>
    </form>
  );
}

export default PublicEnrollment;
