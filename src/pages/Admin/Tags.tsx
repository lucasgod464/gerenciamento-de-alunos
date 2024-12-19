import { DashboardLayout } from "@/components/DashboardLayout";

const Tags = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Etiquetas</h1>
          <p className="text-muted-foreground">
            Gerencie as etiquetas do sistema
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tags;