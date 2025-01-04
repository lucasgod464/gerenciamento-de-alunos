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
import { useParams, useNavigate } from "react-router-dom";

export function PublicEnrollment() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { companyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!companyId) {
      navigate('/');
      return;
    }
    loadFields();
  }, [companyId]);

  const loadFields = async () => {
    try {
      const { data: formFields, error } = await supabase
        .from('enrollment_form_fields')
        .select('*')
        .eq('company_id', companyId)
        .order('order');

      if (error) throw error;

      const validatedFields = (formFields || []).map(field => ({
        id: field.id,
        name: field.name,
        label: field.label,
        type: field.type,
        description: field.description || undefined,
        required: field.required || false,
        order: field.order,
        options: field.options as string[] | undefined,
      }));

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
              {isSubmitting ? "Enviando..." : "Enviar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicEnrollment;
