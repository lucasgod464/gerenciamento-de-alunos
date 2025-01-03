import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormField, SupabaseFormField, mapSupabaseFormField } from "@/types/form"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

const DEFAULT_FIELDS: FormField[] = [
  {
    id: "default-name",
    name: "nome_completo",
    label: "Nome Completo",
    type: "text",
    required: true,
    order: 0,
  },
  {
    id: "default-birthdate",
    name: "data_nascimento",
    label: "Data de Nascimento",
    type: "date",
    required: true,
    order: 1,
  }
];

export default function PublicEnrollment() {
  const [fields, setFields] = useState<FormField[]>([])
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadFormFields = async () => {
      try {
        const { data: formFields, error } = await supabase
          .from('enrollment_form_fields')
          .select('*')
          .order('order', { ascending: true });

        if (error) throw error;

        const validatedFields = (formFields || [])
          .map((field: SupabaseFormField) => mapSupabaseFormField(field));

        const fieldsWithDefaults = [...DEFAULT_FIELDS];
        validatedFields.forEach(field => {
          if (!DEFAULT_FIELDS.some(def => def.name === field.name)) {
            fieldsWithDefaults.push(field);
          }
        });

        setFields(fieldsWithDefaults.sort((a, b) => a.order - b.order));
        
        const initialData: Record<string, any> = {}
        fieldsWithDefaults.forEach((field: FormField) => {
          if (field.type === "multiple") {
            initialData[field.name] = []
          }
        })
        setFormData(initialData)
      } catch (error) {
        console.error('Error loading form fields:', error)
        toast({
          title: "Erro",
          description: "Erro ao carregar campos do formulário",
          variant: "destructive",
        })
      }
    }

    loadFormFields()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert({
          name: formData.nome_completo,
          birth_date: formData.data_nascimento,
          status: true,
          custom_fields: formData
        })
        .select()
        .single();

      if (studentError) throw studentError;

      toast({
        title: "Sucesso",
        description: "Inscrição realizada com sucesso!",
      });

      setFormData({});
      const form = e.target as HTMLFormElement;
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar formulário",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <Input
              type={field.type}
              name={field.name}
              required={field.required}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            />
          </div>
        );
      case "date":
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <Input
              type="date"
              name={field.name}
              required={field.required}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            />
          </div>
        );
      case "textarea":
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <Textarea
              name={field.name}
              required={field.required}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            />
          </div>
        );
      case "select":
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <Select
              name={field.name}
              required={field.required}
              onValueChange={(value) => handleInputChange(field.name, value)}
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
          </div>
        );
      case "multiple":
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.name}-${option}`}
                  checked={formData[field.name]?.includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = formData[field.name] || [];
                    const newValues = checked
                      ? [...currentValues, option]
                      : currentValues.filter((value: string) => value !== option);
                    handleInputChange(field.name, newValues);
                  }}
                />
                <label htmlFor={`${field.name}-${option}`}>{option}</label>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => renderField(field))}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}