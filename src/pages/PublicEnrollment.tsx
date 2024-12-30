import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/types/form";
import { Student } from "@/types/student";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PublicEnrollment = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    const loadFields = () => {
      const savedFields = localStorage.getItem("enrollmentFields");
      if (savedFields) {
        setFields(JSON.parse(savedFields));
      }
    };

    loadFields();
    window.addEventListener("formFieldsUpdated", loadFields);
    return () => window.removeEventListener("formFieldsUpdated", loadFields);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newStudent: Student = {
      id: uuidv4(),
      name: formData.nome_completo || "",
      birthDate: formData.data_nascimento || "",
      room: "",
      status: "active",
      createdAt: new Date().toISOString(),
      companyId: null,
      customFields: formData
    };

    const existingStudents = JSON.parse(localStorage.getItem("students") || "[]");
    const updatedStudents = [...existingStudents, newStudent];
    localStorage.setItem("students", JSON.stringify(updatedStudents));

    toast({
      title: "Sucesso!",
      description: "Inscrição realizada com sucesso.",
    });

    setFormData({});
    window.dispatchEvent(new Event('studentAdded'));
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const sortedFields = [...fields].sort((a, b) => {
    if (a.name === "nome_completo") return -1;
    if (b.name === "nome_completo") return 1;
    if (a.name === "data_nascimento") return -1;
    if (b.name === "data_nascimento") return 1;
    return a.order - b.order;
  });

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "select":
        return (
          <Select
            value={formData[field.name] || ""}
            onValueChange={(value) => handleInputChange(field.name, value)}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder={`Selecione ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "textarea":
        return (
          <Textarea
            id={field.name}
            required={field.required}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full bg-white min-h-[100px] resize-y"
            placeholder={`Digite ${field.label.toLowerCase()}`}
          />
        );
      case "date":
        return (
          <Input
            id={field.name}
            type="date"
            required={field.required}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full bg-white"
          />
        );
      default:
        return (
          <Input
            id={field.name}
            type={field.type}
            required={field.required}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full bg-white"
            placeholder={`Digite ${field.label.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">Formulário de Inscrição</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {sortedFields.map((field) => (
              <div key={field.id} className="text-left">
                <label 
                  htmlFor={field.name} 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label} {field.required && "*"}
                </label>
                {field.description && (
                  <p className="text-sm text-gray-500 mb-2">{field.description}</p>
                )}
                {renderField(field)}
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