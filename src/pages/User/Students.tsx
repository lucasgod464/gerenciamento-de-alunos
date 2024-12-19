import { DashboardLayout } from "@/components/DashboardLayout";
import { StudentRegistration } from "@/components/user/StudentRegistration";
import { StudentTable } from "@/components/user/StudentTable";
import { useState } from "react";
import { Student } from "@/types/student";

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);

  const handleSubmit = (newStudent: Student) => {
    setStudents([...students, newStudent]);
  };

  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Cadastro de Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie o cadastro dos seus alunos
          </p>
        </div>
        <StudentRegistration onSubmit={handleSubmit} students={students} />
        <StudentTable />
      </div>
    </DashboardLayout>
  );
};

export default StudentsPage;