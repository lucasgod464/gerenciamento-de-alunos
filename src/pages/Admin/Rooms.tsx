import { DashboardLayout } from "@/components/DashboardLayout";
import { AdminNav } from "@/components/AdminNav";

const Rooms = () => {
  return (
    <DashboardLayout role="admin">
      <div className="flex">
        <aside className="hidden w-[200px] flex-col md:flex">
          <AdminNav />
        </aside>
        <main className="flex-1 p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Salas</h1>
              <p className="text-muted-foreground">
                Gerencie as salas do sistema
              </p>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default Rooms;