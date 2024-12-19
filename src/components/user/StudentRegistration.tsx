import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentForm } from "./StudentForm";
import { StudentTable } from "./StudentTable";

export const StudentRegistration = () => {
  return (
    <div className="space-y-6">
      <StudentForm />
      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentTable />
        </CardContent>
      </Card>
    </div>
  );
};