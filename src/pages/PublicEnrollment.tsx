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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

export function PublicEnrollment() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [multipleSelections, setMultipleSelections] = useState<Record<string, string[]>>({});
  const { formUrl } = useParams();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

  useEffect(() => {
    loadFormData();
  }, [formUrl]);

  const loadFormData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!formUrl) {
        throw new Error("URL do formulário não encontrada");
      }

      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('enrollment_form_url', formUrl)
        .maybeSingle();

      if (companyError) throw companyError;
      if (!company) throw new Error("Formulário não encontrado");

      const { data: formFields, error: fieldsError } = await supabase
        .from('enrollment_form_fields')
        .select('*')
        .eq('company_id', company.id)
        .order('order');

      if (fieldsError) throw fieldsError;

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
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('enrollment_form_url', formUrl)
        .single();

      const customFields: Record<string, any> = {};
      fields.forEach(field => {
        if (field.name !== "nome_completo" && field.name !== "data_nascimento") {
          let value = data[field.name];
          
          if (field.type === "multiple") {
            value = multipleSelections[field.name]?.join(",") || "";
          }
          
          customFields[field.id] = {
            fieldId: field.id,
            fieldName: field.name,
            label: field.label,
            value: value,
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
          company_id: company.id
        });

      if (studentError) throw studentError;

      toast({
        title: "Sucesso!",
        description: "Formulário enviado com sucesso.",
      });

      // Limpar formulário
      Object.keys(data).forEach(key => {
        setValue(key, '');
      });
      setMultipleSelections({});
      
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
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-12 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-left text-xl sm:text-2xl font-bold">
            Formulário de Inscrição
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome_completo" className="text-left block">
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
              <Label htmlFor="data_nascimento" className="text-left block">
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

            {fields.map(field => {
              if (field.name === "nome_completo" || field.name === "data_nascimento") {
                return null;
              }

              return (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.name} className="text-left block">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  
                  {field.type === "text" && (
                    <Input
                      id={field.name}
                      type="text"
                      {...register(field.name, { required: field.required })}
                      placeholder={`Digite ${field.label.toLowerCase()}`}
                      className="w-full"
                    />
                  )}

                  {field.type === "email" && (
                    <Input
                      id={field.name}
                      type="email"
                      {...register(field.name, { 
                        required: field.required,
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email inválido"
                        }
                      })}
                      placeholder="Digite seu email"
                      className="w-full"
                    />
                  )}

                  {field.type === "tel" && (
                    <Input
                      id={field.name}
                      type="tel"
                      {...register(field.name, { 
                        required: field.required,
                        pattern: {
                          value: /^[0-9]{10,11}$/,
                          message: "Telefone inválido"
                        }
                      })}
                      placeholder="Digite seu telefone"
                      className="w-full"
                    />
                  )}

                  {field.type === "textarea" && (
                    <Textarea
                      id={field.name}
                      {...register(field.name, { required: field.required })}
                      placeholder={`Digite ${field.label.toLowerCase()}`}
                      className="w-full min-h-[100px]"
                    />
                  )}

                  {field.type === "date" && (
                    <Input
                      id={field.name}
                      type="date"
                      {...register(field.name, { required: field.required })}
                      className="w-full"
                    />
                  )}

                  {field.type === "multiple" && (
                    <div className="space-y-2 p-4 bg-gray-50 rounded-md">
                      <ScrollArea className="h-48 w-full rounded-md">
                        {field.options?.map((option) => (
                          <div key={option} className="flex items-center space-x-2 p-2">
                            <Checkbox
                              id={`${field.name}-${option}`}
                              checked={multipleSelections[field.name]?.includes(option)}
                              onCheckedChange={(checked) => {
                                setMultipleSelections(prev => {
                                  const current = prev[field.name] || [];
                                  if (checked) {
                                    return {
                                      ...prev,
                                      [field.name]: [...current, option]
                                    };
                                  } else {
                                    return {
                                      ...prev,
                                      [field.name]: current.filter(item => item !== option)
                                    };
                                  }
                                });
                              }}
                            />
                            <label
                              htmlFor={`${field.name}-${option}`}
                              className="text-sm font-medium leading-none"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  )}

                  {field.type === "select" && (
                    <Select 
                      onValueChange={(value) => setValue(field.name, value)}
                      {...register(field.name, { required: field.required })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={`Selecione ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        <ScrollArea className="h-[200px]">
                          {field.options?.map(option => (
                            <SelectItem key={option} value={option} className="cursor-pointer">
                              {option}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  )}
                  
                  {errors[field.name] && (
                    <p className="text-sm text-red-500">
                      {typeof errors[field.name]?.message === 'string' 
                        ? errors[field.name]?.message 
                        : "Este campo é obrigatório"}
                    </p>
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