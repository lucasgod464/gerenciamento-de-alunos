import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams, useNavigate } from "react-router-dom";

export function PublicEnrollment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const companyId = searchParams.get('company');
  const [fields, setFields] = useState<FormField[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (!companyId) {
      toast({
        title: "Erro",
        description: "Link de inscrição inválido",
        variant: "destructive",
      });
      return;
    }
    loadFields();
  }, [companyId]);

  const loadFields = async () => {
    try {
      // Primeiro, carregamos os campos padrão
      const defaultFields: FormField[] = [
        {
          id: "nome_completo",
          name: "nome_completo",
          label: "Nome Completo",
          type: "text",
          required: true,
          order: 0,
        },
        {
          id: "data_nascimento",
          name: "data_nascimento",
          label: "Data de Nascimento",
          type: "date",
          required: true,
          order: 1,
        }
      ];

      // Depois, carregamos os campos personalizados do banco
      const { data: customFields, error } = await supabase
        .from('enrollment_form_fields')
        .select('*')
        .eq('company_id', companyId)
        .order('order');

      if (error) throw error;

      console.log("Campos personalizados carregados:", customFields); // Debug

      const mappedCustomFields = (customFields || []).map(field => ({
        id: field.id,
        name: field.name,
        label: field.label,
        type: field.type as FormField['type'],
        description: field.description || undefined,
        required: field.required || false,
        order: field.order,
        options: field.options as string[] | undefined,
      }));

      // Combinamos os campos padrão com os personalizados
      const allFields = [...defaultFields, ...mappedCustomFields];
      console.log("Todos os campos:", allFields); // Debug
      setFields(allFields);
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
    if (!companyId) {
      toast({
        title: "Erro",
        description: "Link de inscrição inválido",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const customFields: Record<string, any> = {};
      fields.forEach(field => {
        if (field.name !== "nome_completo" && field.name !== "data_nascimento") {
          customFields[field.id] = {
            fieldId: field.id,
            fieldName: field.name,
            label: field.label,
            value: data[field.name],
            type: field.type
          };
        }
      });

      const { error: studentError } = await supabase
        .from('students')
        .insert({
          name: data.nome_completo,
          birth_date: data.data_nascimento,
          status: true,
          custom_fields: customFields,
          company_id: companyId
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Formulário de Inscrição</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {fields.map(field => (
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
            ))}
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default PublicEnrollment;