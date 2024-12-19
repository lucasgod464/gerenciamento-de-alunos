import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/types/student";

export const AttendanceControl = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    // Aqui você faria a chamada para a API para buscar os alunos
    // Por enquanto, vamos usar dados mockados
    const mockStudents: Student[] = [
      {
        id: "1",
        name: "João Silva",
        email: "joao@example.com",
        phone: "(11) 99999-9999",
        status: true,
        companyId: companyId || "",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Maria Santos",
        email: "maria@example.com",
        phone: "(11) 88888-8888",
        status: true,
        companyId: companyId || "",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Pedro Oliveira",
        email: "pedro@example.com",
        phone: "(11) 77777-7777",
        status: true,
        companyId: companyId || "",
        createdAt: new Date().toISOString(),
      }
    ];

    setStudents(mockStudents.filter(student => student.companyId === companyId));
  }, [companyId]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Controle de Presença</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p>Nenhum aluno encontrado.</p>
          ) : (
            <div className="space-y-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
                      onClick={() => {
                        // Aqui você implementaria a lógica para marcar presença
                        console.log(`Marcando presença para ${student.name}`);
                      }}
                    >
                      Presente
                    </button>
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                      onClick={() => {
                        // Aqui você implementaria a lógica para marcar falta
                        console.log(`Marcando falta para ${student.name}`);
                      }}
                    >
                      Falta
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};