import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/types/form";

const ENROLLMENT_FIELDS_KEY = "enrollmentFields";

const PublicEnrollment = () => {
  const [fields, setFields] = useState<FormField[]>([]);

  useEffect(() => {
    const loadFields = () => {
      try {
        const savedFields = localStorage.getItem(ENROLLMENT_FIELDS_KEY);
        if (savedFields) {
          setFields(JSON.parse(savedFields));
        }
      } catch (error) {
        console.error("Error loading form fields:", error);
        setFields([]);
      }
    };

    loadFields();
    window.addEventListener('enrollmentFieldsUpdated', loadFields);
    
    return () => {
      window.removeEventListener('enrollmentFieldsUpdated', loadFields);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const studentData = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      companyId: null,
      customFields: Object.fromEntries(formData.entries()),
    };

    // Salvar os dados do aluno
    const submissions = JSON.parse(localStorage.getItem("enrollmentSubmissions") || "[]");
    submissions.push(studentData);
    localStorage.setItem("enrollmentSubmissions", JSON.stringify(submissions));

    alert("Inscrição realizada com sucesso!");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Formulário de Inscrição</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    className="w-full p-2 border rounded-md"
                  />
                ) : field.type === "select" ? (
                  <select
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    className="w-full p-2 border rounded-md"
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    className="w-full p-2 border rounded-md"
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-primary text-white p-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Enviar Inscrição
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicEnrollment;