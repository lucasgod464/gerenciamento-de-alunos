import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const PublicRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    switch (user.role) {
      case "SUPER_ADMIN":
        return <Navigate to="/super-admin" replace />;
      case "ADMIN":
        return <Navigate to="/admin" replace />;
      case "USER":
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};