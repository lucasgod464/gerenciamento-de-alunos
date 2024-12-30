import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/types/form";
import { Student } from "@/types/student";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

const ENROLLMENT_FIELDS_KEY = "enrollmentFields";

const PublicEnrollment = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    const loadFields = () => {
      try {
        const savedFields = localStorage.getItem(ENROLLMENT_FIELDS_KEY);
        console.log("Carregando campos do formulário público:", savedFields);
        if (savedFields) {
          const parsedFields = JSON.parse(savedFields);
          setFields(parsedFields);
          console.log("Campos carregados com sucesso:", parsedFields);
        }
      } catch (error) {
        console.error("Erro ao carregar campos:", error);
      }
    };

    loadFields();
    window.addEventListener('storage', loadFields);
    window.addEventListener('enrollmentFieldsUpdated', loadFields);

    return () => {
      window.removeEventListener('storage', loadFields);
      window.removeEventListener('enrollmentFieldsUpdated', loadFields);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campo obrigatório de nome
    if (!formData.nome_completo) {
      toast({
        title: "Erro",
        description: "O campo Nome Completo é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    // Criar novo aluno com os dados do formulário
    const newStudent: Student = {
      id: uuidv4(),
      name: formData.nome_completo,
      birthDate: "",
      room: "", // Sem sala inicialmente
      status: "active",
      createdAt: new Date().toISOString(),
      companyId: null,
      customFields: formData
    };

    // Salvar o novo aluno no localStorage
    const existingStudents = JSON.parse(localStorage.getItem("students") || "[]");
    const updatedStudents = [...existingStudents, newStudent];
    localStorage.setItem("students", JSON.stringify(updatedStudents));

    // Mostrar mensagem de sucesso
    toast({
      title: "Sucesso!",
      description: "Inscrição realizada com sucesso.",
    });

    // Limpar formulário
    setFormData({});
    
    // Resetar os campos do formulário
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  if (fields.length === 0) {
    console.log("Nenhum campo encontrado no formulário");
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-6">Formulário de Inscrição</h1>
            <p className="text-gray-500">O formulário está sendo carregado ou não possui campos configurados.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">Formulário de Inscrição</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label 
                  htmlFor={field.name} 
                  className="block text-sm font-medium text-gray-700"
                >
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full"
                  placeholder={`Digite ${field.label.toLowerCase()}`}
                />
              </div>
            ))}
            <Button type="submit" className="w-full">
              Enviar Inscrição
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicEnrollment;