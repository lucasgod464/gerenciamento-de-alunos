import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const PublicRoute = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};