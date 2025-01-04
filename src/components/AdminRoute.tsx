import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user } = useAuth();

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}