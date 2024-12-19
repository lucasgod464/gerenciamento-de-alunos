import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Student } from "@/types/student";
import { FormField } from "@/types/form-builder";
import { DynamicFormField } from "../form-builder/DynamicFormField";
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

interface StudentFormProps {
  onSubmit: (student: Student) => void;
}

export const StudentForm = ({ onSubmit }: StudentFormProps) => {
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser?.companyId) return;
    
    // Load rooms
    const storedRooms = localStorage.getItem("rooms");
    if (storedRooms) {
      const allRooms = JSON.parse(storedRooms);
      const companyRooms = allRooms.filter(
        (room: { companyId: string | null }) => room.companyId === currentUser.companyId
      );
      setRooms(companyRooms);
      if (companyRooms.length > 0) {
        setSelectedRoom(companyRooms[0].id);
      }
    }

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const formValues: Record<string, any> = {};
    formFields.forEach((field) => {
      formValues[field.name] = formData.get(field.id);
    });

    const studentData = {
      ...formValues,
      room: selectedRoom,
      status: status,
      createdAt: new Date().toISOString(),
      companyId: currentUser?.companyId || null,
    };

    const newStudent: Student = editingStudent
      ? { ...editingStudent, ...studentData }
      : { id: Math.random().toString(36).substr(2, 9), ...studentData };

    const updatedStudents = editingStudent
      ? students.map((s) => (s.id === editingStudent.id ? newStudent : s))
      : [...students, newStudent];

    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    
    toast({
      title: editingStudent ? "Aluno atualizado" : "Aluno adicionado",
      description: `O aluno foi ${editingStudent ? "atualizado" : "adicionado"} com sucesso.`,
    });

    setEditingStudent(null);
    e.currentTarget.reset();
    setStatus("active");
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setStatus(student.status);
    setSelectedRoom(student.room);
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
      <Card>
        <CardHeader>
          <CardTitle>
            {editingStudent ? "Editar Aluno" : "Novo Aluno"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            {formFields.map((field) => (
              <DynamicFormField
                key={field.id}
                field={field}
                defaultValue={editingStudent?.[field.name]}
              />
            ))}

            <div className="space-y-2">
              <Label htmlFor="room">Sala</Label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a sala" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="status" 
                  checked={status === "active"}
                  onCheckedChange={(checked) => setStatus(checked ? "active" : "inactive")}
                />
                <Label htmlFor="status">Ativo</Label>
              </div>
            </div>

            <Button type="submit" className="md:col-span-2">
              {editingStudent ? (
                <>
                  <Pencil className="mr-2 h-4 w-4" />
                  Atualizar Aluno
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Aluno
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

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
                <td className="p-2">
                  {rooms.find((r) => r.id === student.room)?.name || "N/A"}
                </td>
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