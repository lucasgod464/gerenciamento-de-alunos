import { DashboardLayout } from "@/components/DashboardLayout";
import { EnrollmentFormBuilder } from "@/components/enrollment/EnrollmentFormBuilder";
import { EnrollmentFormHeader } from "@/components/enrollment/EnrollmentFormHeader";
import { Separator } from "@/components/ui/separator";

const AdminEnrollment = () => {
  return (
    <DashboardLayout role="admin">
      <div className="max-w-5xl mx-auto space-y-8 p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Configuração do Formulário</h1>
          <p className="text-muted-foreground">
            Personalize os campos e seções do formulário de inscrição
          </p>
        </div>

        <div className="grid gap-8">
          <div className="space-y-6">
            <EnrollmentFormHeader />
            <Separator className="my-6" />
            <EnrollmentFormBuilder />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminEnrollment;