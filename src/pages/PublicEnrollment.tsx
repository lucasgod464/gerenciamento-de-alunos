import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/types/form";

const PublicEnrollment = () => {
  const [fields, setFields] = useState<FormField[]>([]);

  useEffect(() => {
    const loadFields = () => {
      const savedFields = localStorage.getItem("formFields");
      if (savedFields) {
        setFields(JSON.parse(savedFields));
      }
    };

    loadFields();
    window.addEventListener('formFieldsUpdated', loadFields);
    
    return () => {
      window.removeEventListener('formFieldsUpdated', loadFields);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const studentData = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get("fullName") as string,
      birthDate: formData.get("birthDate") as string,
      status: formData.get("status") as "active" | "inactive",
      room: "",
      createdAt: new Date().toISOString(),
      companyId: null,
      customFields: {},
    };

    // Salvar os dados do aluno
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const firstRoom = allRooms[0];
    if (firstRoom) {
      firstRoom.students = [...(firstRoom.students || []), studentData];
      localStorage.setItem("rooms", JSON.stringify(allRooms));
    }

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