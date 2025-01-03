import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField, SupabaseFormField, mapSupabaseFormField } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
        .map((field: SupabaseFormField) => mapSupabaseFormField(field))
        .filter(field => field.name !== 'nome_completo' && field.name !== 'data_nascimento'); // Remove default fields if they exist

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
      // Validate required fields
      if (!data.nome_completo || !data.data_nascimento) {
        throw new Error("Nome completo e data de nascimento são obrigatórios");
      }

      const { error } = await supabase
        .from('students')
        .insert({
          name: data.nome_completo,
          birth_date: data.data_nascimento,
          status: true,
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
        description: error instanceof Error ? error.message : "Não foi possível enviar sua inscrição. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
              {/* Required fields always present */}
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

              {/* Dynamic custom fields */}
              {fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {field.description && (
                    <p className="text-sm text-muted-foreground">{field.description}</p>
                  )}
                  <Input
                    {...register(field.name, { required: field.required })}
                    type={field.type === "date" ? "date" : "text"}
                  />
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