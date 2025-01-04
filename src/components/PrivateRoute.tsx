import { Navigate, Outlet } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import { useAuth } from "@/hooks/useAuth";

export const PrivateRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <DashboardLayout role="admin">
      <Outlet />
    </DashboardLayout>
  );
};