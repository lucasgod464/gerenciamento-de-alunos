import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AccessLevel } from "@/types/auth";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: AccessLevel[];
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};