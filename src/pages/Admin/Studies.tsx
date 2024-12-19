import { DashboardLayout } from "@/components/DashboardLayout";

const Studies = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Estudos</h1>
          <p className="text-muted-foreground">
            Gerencie os estudos do sistema
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Studies;