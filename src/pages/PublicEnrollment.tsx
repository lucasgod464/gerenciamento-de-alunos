import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export function PublicEnrollment() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { formUrl } = useParams();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    loadFormData();
  }, [formUrl]);

  const loadFormData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!formUrl) {
        console.error("URL do formulário não encontrada");
        throw new Error("URL do formulário não encontrada");
      }

      console.log("URL do formulário recebida:", formUrl);
      
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('enrollment_form_url', formUrl)
        .maybeSingle();

      console.log("Resultado da busca da empresa:", { company, error: companyError });

      if (companyError) {
        console.error("Erro ao buscar empresa:", companyError);
        throw companyError;
      }

      if (!company) {
        console.error("Empresa não encontrada para a URL:", formUrl);
        throw new Error("Formulário não encontrado ou inválido");
      }

      console.log("Empresa encontrada:", company);
      console.log("Buscando campos do formulário para a empresa:", company.id);

      const { data: formFields, error: fieldsError } = await supabase
        .from('enrollment_form_fields')
        .select('*')
        .eq('company_id', company.id)
        .order('order');

      if (fieldsError) {
        console.error("Erro ao buscar campos do formulário:", fieldsError);
        throw fieldsError;
      }

      console.log("Campos do formulário encontrados:", formFields);

      const validatedFields = (formFields || []).map(field => ({
        id: field.id,
        name: field.name,
        label: field.label,
        type: field.type as FormField['type'],
        description: field.description || undefined,
        required: field.required || false,
        order: field.order,
        options: field.options as string[] | undefined,
      }));

      setFields(validatedFields);
    } catch (error) {
      console.error("Erro ao carregar formulário:", error);
      setError(error instanceof Error ? error.message : "Erro ao carregar formulário");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('id')
        .eq('enrollment_form_url', formUrl)
        .maybeSingle();

      if (companiesError) throw companiesError;
      if (!companies) throw new Error("Empresa não encontrada");

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Formulário de Inscrição
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Campos obrigatórios */}
            <div className="space-y-2">
              <Label htmlFor="nome_completo">
                Nome Completo
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="nome_completo"
                {...register("nome_completo", { required: true })}
                placeholder="Digite seu nome completo"
                className="w-full"
              />
              {errors.nome_completo && (
                <p className="text-sm text-red-500">Este campo é obrigatório</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_nascimento">
                Data de Nascimento
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="data_nascimento"
                type="date"
                {...register("data_nascimento", { required: true })}
                className="w-full"
              />
              {errors.data_nascimento && (
                <p className="text-sm text-red-500">Este campo é obrigatório</p>
              )}
            </div>

            {/* Campos customizados */}
            {fields.map(field => {
              if (field.name === "sala" || field.name === "status") {
                return null;
              }

              if (field.name === "nome_completo" || field.name === "data_nascimento") {
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
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default PublicEnrollment;