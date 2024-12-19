import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AccessLevel, ROLE_PERMISSIONS, RolePermissions } from "@/types/auth";

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

  if (!user) return null;

  // Check role access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  // Check company access
  if (companyId && !isCompanyMember(companyId)) {
    return null;
  }

  // Check permissions
  const hasAllPermissions = requiredPermissions.every((permission) => can(permission));
  if (!hasAllPermissions) {
    return null;
  }

  return <>{children}</>;
}