import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Student } from "@/types/student";
import { FormField } from "@/types/form-builder";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { FormPreview } from "../form-builder/FormPreview";

interface StudentFormProps {
  onSubmit: (student: Student) => void;
}

export const StudentForm = ({ onSubmit }: StudentFormProps) => {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser?.companyId) return;
    
    // Load form fields
    const savedFields = localStorage.getItem("formFields");
    if (savedFields) {
      const parsedFields = JSON.parse(savedFields);
      const companyFields = parsedFields.filter(
        (field: FormField) => field.companyId === currentUser.companyId
      );
      setFormFields(companyFields);
    }

    // Load students
    const savedStudents = localStorage.getItem("students");
    if (savedStudents) {
      const allStudents = JSON.parse(savedStudents);
      const companyStudents = allStudents.filter(
        (student: Student) => student.companyId === currentUser.companyId
      );
      setStudents(companyStudents);
    }
  }, [currentUser]);

  const handleSubmit = (formValues: Record<string, any>) => {
    const studentData: Student = {
      id: editingStudent?.id || Math.random().toString(36).substr(2, 9),
      name: formValues.name || "",
      birthDate: formValues.birthDate || "",
      email: formValues.email || "",
      document: formValues.document || "",
      address: formValues.address || "",
      room: formValues.room || "",
      status: formValues.status || "active",
      createdAt: editingStudent?.createdAt || new Date().toISOString(),
      companyId: currentUser?.companyId || null,
    };

    onSubmit(studentData);
    
    const updatedStudents = editingStudent
      ? students.map((s) => (s.id === editingStudent.id ? studentData : s))
      : [...students, studentData];

    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    
    toast({
      title: editingStudent ? "Aluno atualizado" : "Aluno adicionado",
      description: `O aluno foi ${editingStudent ? "atualizado" : "adicionado"} com sucesso.`,
    });

    setEditingStudent(null);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
  };

  const handleDelete = (studentId: string) => {
    const updatedStudents = students.filter((s) => s.id !== studentId);
    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    
    toast({
      title: "Aluno removido",
      description: "O aluno foi removido com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <FormPreview fields={formFields} onSubmit={handleSubmit} />

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-2 text-left">Nome</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Sala</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b">
                <td className="p-2">{student.name}</td>
                <td className="p-2">{student.email}</td>
                <td className="p-2">{student.room}</td>
                <td className="p-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      student.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {student.status === "active" ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="p-2 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(student)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover aluno</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover este aluno? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(student.id)}>
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};