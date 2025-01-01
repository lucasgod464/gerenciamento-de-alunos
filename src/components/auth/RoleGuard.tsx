import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AccessLevel, ROLE_PERMISSIONS, RolePermissions } from "@/types/auth";
import { Navigate } from "react-router-dom";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: AccessLevel[];
  companyId?: string;
  requiredPermissions?: Array<keyof RolePermissions>;
}

export function RoleGuard({
  children,
  allowedRoles,
  companyId,
  requiredPermissions = [],
}: RoleGuardProps) {
  const { user, can, isCompanyMember } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user's role
    switch (user.role) {
      case "SUPER_ADMIN":
        return <Navigate to="/super-admin" replace />;
      case "ADMIN":
        return <Navigate to="/admin" replace />;
      case "USER":
        return <Navigate to="/user" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // Check company access
  if (companyId && !isCompanyMember(companyId)) {
    return <Navigate to="/login" replace />;
  }

  // Check permissions
  const hasAllPermissions = requiredPermissions.every((permission) => can(permission));
  if (!hasAllPermissions) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}