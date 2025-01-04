import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface TeacherRouteProps {
  children: ReactNode;
}

export function TeacherRoute({ children }: TeacherRouteProps) {
  const { user } = useAuth();

  if (!user || user.role !== "TEACHER") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}