import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Student } from "@/types/student";
import { useToast } from "@/hooks/use-toast";

interface StudentRegistrationProps {
  onSubmit: (newStudent: Student) => void;
  students: Student[];
}

export const StudentRegistration = ({ onSubmit, students }: StudentRegistrationProps) => {
  const { toast } = useToast();
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: "",
    email: "",
    phone: "",
    status: true,
    companyId: localStorage.getItem("companyId") || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudent.name && newStudent.email && newStudent.phone) {
      const student = {
        ...newStudent,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      } as Student;
      
      onSubmit(student);
      setNewStudent({
        name: "",
        email: "",
        phone: "",
        status: true,
        companyId: localStorage.getItem("companyId") || "",
      });

      toast({
        title: "Sucesso",
        description: "Aluno cadastrado com sucesso!",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={newStudent.name}
          onChange={(e) =>
            setNewStudent({ ...newStudent, name: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={newStudent.email}
          onChange={(e) =>
            setNewStudent({ ...newStudent, email: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          value={newStudent.phone}
          onChange={(e) =>
            setNewStudent({ ...newStudent, phone: e.target.value })
          }
          required
        />
      </div>

      <Button type="submit">Cadastrar Aluno</Button>
    </form>
  );
};