import { DashboardLayout } from "@/components/DashboardLayout";
import { FormBuilder } from "@/components/form-builder/FormBuilder";

const AdminFormBuilder = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Construtor de Formulário</h1>
          <p className="text-muted-foreground">
            Personalize o formulário de cadastro de alunos
          </p>
        </div>
        <FormBuilder />
      </div>
    </DashboardLayout>
  );
};

export default AdminFormBuilder;