import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField, mapSupabaseFormField, defaultFields } from "@/types/form";
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
      console.log("Iniciando carregamento de campos para company_id:", companyId);

      // Primeiro, carregamos os campos personalizados
      const { data: customFields, error } = await supabase
        .from('enrollment_form_fields')
        .select('*')
        .eq('company_id', companyId)
        .order('order');

      if (error) {
        console.error("Erro ao carregar campos personalizados:", error);
        throw error;
      }

      console.log("Campos personalizados brutos:", customFields);

      // Mapeamos os campos personalizados
      const mappedCustomFields = customFields ? customFields.map(field => ({
        id: field.id,
        name: field.name,
        label: field.label,
        type: field.type as FormField['type'],
        description: field.description || undefined,
        required: field.required || false,
        order: field.order,
        options: field.options as string[] | undefined,
      })) : [];

      console.log("Campos personalizados mapeados:", mappedCustomFields);

      // Filtramos os campos padrão que não queremos mostrar
      const filteredDefaultFields = defaultFields.filter(
        field => field.name !== "sala" && field.name !== "status"
      );

      console.log("Campos padrão filtrados:", filteredDefaultFields);

      // Combinamos os campos
      const allFields = [...filteredDefaultFields, ...mappedCustomFields];
      console.log("Todos os campos combinados:", allFields);
      
      setFields(allFields);
    } catch (error) {
      console.error("Erro ao carregar campos do formulário:", error);
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
      console.log("Dados do formulário a serem enviados:", data);

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

      console.log("Campos personalizados formatados:", customFields);

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
      console.error("Erro ao enviar formulário:", error);
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