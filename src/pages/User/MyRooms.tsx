import { DashboardLayout } from "@/components/DashboardLayout";
import { UserRooms } from "@/components/user/UserRooms";

const MyRooms = () => {
  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Minhas Salas</h1>
          <p className="text-muted-foreground">
            Visualize as salas às quais você tem acesso
          </p>
        </div>

        <UserRooms />
      </div>
    </DashboardLayout>
  );
};

export default MyRooms;