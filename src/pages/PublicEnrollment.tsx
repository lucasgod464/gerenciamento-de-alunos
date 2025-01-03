import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormField } from "@/types/form"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export default function PublicEnrollment() {
  const [fields, setFields] = useState<FormField[]>([])
  const [formData, setFormData] = useState<Record<string, any>>({})
  const { toast } = useToast()

  useEffect(() => {
    loadFields()
  }, [])

  const loadFields = async () => {
    try {
      const { data: formFields, error } = await supabase
        .from('enrollment_form_fields')
        .select('*')
        .order('order');

      if (error) throw error;

      // Validar e converter os tipos dos campos
      const validatedFields: FormField[] = formFields.map(field => ({
        ...field,
        type: field.type as FieldType,
      }));

      setFields(validatedFields);
      
      const initialData: Record<string, any> = {}
      validatedFields.forEach((field: FormField) => {
        if (field.type === "multiple") {
          initialData[field.name] = []
        }
      })
      setFormData(initialData)
    } catch (error) {
      console.error("Erro ao carregar campos do formulário:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar o formulário. Por favor, tente novamente.",
        variant: "destructive"
      })
    }
  }

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleMultipleChoiceChange = (name: string, option: string, checked: boolean) => {
    setFormData((prev) => {
      const currentValues = prev[name] || []
      if (checked) {
        return {
          ...prev,
          [name]: [...currentValues, option],
        }
      } else {
        return {
          ...prev,
          [name]: currentValues.filter((value: string) => value !== option),
        }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const missingFields = fields
      .filter((field) => field.required)
      .filter((field) => {
        if (field.type === "multiple") {
          return !formData[field.name] || formData[field.name].length === 0
        }
        return !formData[field.name]
      })
      .map((field) => field.label)

    if (missingFields.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: `Por favor, preencha os seguintes campos: ${missingFields.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase
        .from('students')
        .insert({
          name: formData.nome_completo,
          birth_date: formData.data_nascimento,
          status: true,
          custom_fields: formData
        });

      if (error) throw error;

      setFormData({})
      
      toast({
        title: "Formulário enviado",
        description: "Seus dados foram enviados com sucesso!",
      })
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
      toast({
        title: "Erro",
        description: "Não foi possível enviar o formulário. Por favor, tente novamente.",
        variant: "destructive"
      })
    }
  }

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            id={field.name}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
            className="min-h-[100px] resize-y"
          />
        )
      case "select":
        return (
          <Select
            value={formData[field.name] || ""}
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
        )
      case "multiple":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.name}-${option}`}
                  checked={(formData[field.name] || []).includes(option)}
                  onCheckedChange={(checked) => 
                    handleMultipleChoiceChange(field.name, option, checked as boolean)
                  }
                />
                <label
                  htmlFor={`${field.name}-${option}`}
                  className="text-sm text-gray-700"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        )
      default:
        return (
          <Input
            id={field.name}
            name={field.name}
            type={field.type}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">Formulário de Inscrição</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="text-left">
                <label 
                  htmlFor={field.name} 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.description && (
                  <p className="text-sm text-gray-500 mb-2">{field.description}</p>
                )}
                {renderField(field)}
              </div>
            ))}
            <Button type="submit" className="w-full">
              Enviar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}